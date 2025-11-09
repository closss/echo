---
title: Transformer里的位置编码有几种实现方式？
published: 2025-11-09
updated: 2025-11-09
description: ''
image: ''
tags: ["Transformer","位置编码"]
category: 算法八股
pinned: false
draft: false
---

## 问题
类似Transformer里面的位置编码有几种主要的实现方式？都有什么区别？

## 思路
- 绝对位置编码（正余弦位置编码、Learned绝对位置编码）
- 相对位置编码（）

## 答案

Transformer模型本身（特指Self-Attention机制）并不包含序列中Token的顺序信息，因此必须通过“位置编码”（Positional Encoding, PE）来将位置信息“注入”到模型中。

目前主流的实现方式可以分为两大类：绝对位置编码 (Absolute Positional Encoding) 和 相对位置编码 (Relative Positional Encoding)。

---
### 1、绝对位置编码

这类方法为序列中的每一个绝对位置（如第1、第2、第3个Token）分配一个唯一的位置向量。

#### 方式一：Sinusoidal (正弦/余弦) 位置编码

这是"Attention Is All You Need" (Transformer G) 论文中提出的原始方法。

**实现方式：** 它使用一组不同频率的 $\sin$ 和 $\cos$ 函数来为每个位置 $(pos)$ 的每个维度 $(i)$ 生成一个固定的向量。公式如下：

- $ PE(pos, 2i) = \sin(pos / 10000^{2i/d_{model}}) $ 

- $ PE(pos, 2i+1) = \cos(pos / 10000^{2i/d_{model}}) $

其中 $d_{model}$ 是词嵌入的维度。这个向量会直接加到词嵌入向量上。

**区别与特点：**

- 固定性：这种编码是固定的，不需要训练。

- 外推性： 理论上，它可以推广到比训练时遇到的序列更长的序列（尽管效果可能会下降），因为它是一个周期函数。

- 相对信息： 它的设计使得任意两个位置 $pos$ 和 $pos+k$ 之间的位置编码 $PE(pos+k)$ 都可以通过 $PE(pos)$ 的线性变换得到，这被认为有助于模型学习相对位置信息。

#### 方式二：Learned (可学习的) 绝对位置编码

这种方法被用于BERT、GPT-2、ViT (Vision Transformer) 等众多模型中。

**实现方式：** 非常简单。它创建一个与词嵌入表（Vocabulary Embedding）类似的位置嵌入表（Position Embedding Table）。

  - 假设模型处理的最大序列长度为 max_seq_len（例如BERT中的512），嵌入维度为 $d_{model}$。

  - 模型会创建一个大小为 (max_seq_len, d_model) 的可训练参数矩阵。

  - 第 $k$ 个Token会查询这个表的第 $k$ 行向量，然后将其加到词嵌入上。

**区别与特点：**

- 可学习： 这种编码是通过反向传播学习的，模型可以自行决定如何最好地表示位置。

- 灵活性高： 理论上可以学习到比固定Sinusoidal更优的表示。

- 外推性差： 这是它的致命弱点。如果模型训练时的最大长度是512，那么它根本没有为第513个位置学习过任何向量，导致无法处理更长的序列（除非进行微调或插值）。

---

### 2、相对位置编码 (Relative Positional Encoding)

这类方法认为，模型真正需要知道的不是“我在第100位”，而是“我相对于另一个Token有多远”（例如，“我在Key之前3个位置”）。

#### 方式三：经典相对位置编码 (T5, Transformer-XL)

这种方法不把位置信息加到输入嵌入中，而是在Attention计算过程中引入位置信息。

**实现方式：**
它修改了自注意力的计算公式。原始的Attention分数是 $score = Q \cdot K^T$。

- Transformer-XL 和 Shaw et al. (2018) 的版本比较复杂，它们在计算Attention分数时，将Query与Key的相对位置表示 $R_{i-j}$ 相乘。

- T5模型 使用了一个更简单的版本：在计算完 $Q \cdot K^T$ 得到 $logits$ 矩阵后，直接加上一个偏置（Bias）。

- 这个Bias是一个可学习的标量，它取决于Query和Key的相对距离 $(i - j)$。例如，距离为-2、-1、0、1、2... 都会对应一个学到的偏置值。为了节省参数，T5还对远距离进行了“分桶”（Bucket），比如所有距离 > 8 的都共享同一个偏置。

**区别与特点：**

- 修改Attention： 核心区别在于它修改了Attention机制的核心，而不是输入。

- 关注相对距离： 直接对“Token A和Token B相距多远”进行建模。

- 平移不变性： 无论是在序列的开头还是结尾，只要两个Token的相对距离相同，它们得到的相对位置偏置就相同。

#### 方式四：RoPE (Rotary Position Embedding, 旋转位置编码)

这是目前（尤其是在LLM中）最先进和最流行的方法之一，被LLaMA、PaLM、GPT-NeoX等模型采用。

**实现方式：**
RoPE是一种非常巧妙的设计。它也利用了 $\sin$ 和 $\cos$ 函数，但用法完全不同。

  1) 它不加位置编码，而是用位置信息来旋转 Query (Q) 和 Key (K) 向量。

  2) 具体来说，它将Q和K向量的维度两两分组，看作复数。

  3) 然后，根据Token的绝对位置 $m$，将其乘以一个旋转矩阵 $R_m$（该矩阵由 $\sin(m\theta)$ 和 $\cos(m\theta)$ 构成）。

  4) 神奇之处在于，经过旋转后的 $Q_m$ 和 $K_n$ 进行点积（计算Attention分数）时，其结果只与相对位置 $(m-n)$ 和Q、K的原始内容相关。

**区别与特点：**

- **利用绝对位置实现相对位置：** 这是它的核心。它使用Token的绝对位置（$m$ 和 $n$）来旋转向量，但最终的Attention分数只依赖于相对位置（$m-n$）。

- 外推性强： RoPE在处理比训练时更长的序列方面表现非常好（优于ALiBi之外的大多数方法）。

- 性能优异： 在各种评测中通常表现出SOTA（State-of-the-art）的性能。

#### 方式五：ALiBi (Attention with Linear Biases)

ALiBi是另一种在LLM（如BLOOM）中非常成功的方法，它以简单和强大的外推性著称。

**实现方式：** ALiBi和T5的相对位置编码有些类似，都是给Attention的 $logits$ 矩阵加一个偏置。

- 区别在于： ALiBi的偏置是固定且非学习的。

- 这个偏置值是一个简单的线性惩罚：$logits_{i,j} = Q_i \cdot K_j^T - m \cdot |i-j|$

- $m$ 是一个固定的、与注意力头（Head）相关的超参数。

- 简单来说：两个Token离得越远，它们的Attention分数受到的“惩罚”就越大，使模型更关注附近的Token。

**区别与特点：**

- 极其简单： 实现非常容易，不需要额外参数。

- 外推性极强： 它的外推能力是所有方法中最好的之一。因为即使在训练时没见过长度1000，当遇到1000时，它也只是施加一个更大的线性惩罚而已，模型可以自然地处理。

