"""
Oxford Pets Breed Similarity Analysis - Matplotlib Version
"""
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

print("📊 Loading similarity matrix...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
similarity_df = pd.read_csv(base_url + 'similarity_matrix.csv', index_col=0)
print(f"✓ Loaded {similarity_df.shape[0]}×{similarity_df.shape[1]} matrix")

breeds = similarity_df.columns.tolist()
similarity_matrix = similarity_df.values

fig, ax = plt.subplots(figsize=(14, 12))

im = ax.imshow(similarity_matrix, cmap='RdYlBu_r', aspect='auto', vmin=0, vmax=1)

ax.set_xticks(np.arange(len(breeds)))
ax.set_yticks(np.arange(len(breeds)))
ax.set_xticklabels(breeds, rotation=45, ha='right', fontsize=8)
ax.set_yticklabels(breeds, fontsize=8)

plt.colorbar(im, ax=ax, label='Cosine Similarity')
ax.set_title('Breed Similarity Matrix (37×37)\nBased on ResNet50 Features', 
             fontsize=14, fontweight='bold', pad=20)

plt.tight_layout()
plt.show()

print("\n✅ Heatmap complete!")
print("💡 Red = dissimilar, Blue = similar")
