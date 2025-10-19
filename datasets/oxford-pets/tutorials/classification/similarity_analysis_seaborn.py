"""
Oxford Pets Breed Similarity Analysis - Seaborn Version
Beautiful heatmap with Seaborn for breed similarity analysis.
"""
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="white")

print("📊 Loading similarity matrix...")
base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
similarity_df = pd.read_csv(base_url + 'similarity_matrix.csv', index_col=0)
print(f"✓ Loaded {similarity_df.shape[0]}×{similarity_df.shape[1]} matrix")

fig, ax = plt.subplots(figsize=(14, 12))

sns.heatmap(
    similarity_df,
    cmap='RdYlBu_r',
    center=0.5,
    square=True,
    linewidths=0.5,
    cbar_kws={"shrink": 0.8, "label": "Cosine Similarity"},
    ax=ax,
    xticklabels=True,
    yticklabels=True,
    vmin=0,
    vmax=1
)

ax.set_title('Breed Similarity Matrix (37×37)\nBased on ResNet50 Features',
             fontsize=14, fontweight='bold', pad=20)

plt.xticks(rotation=45, ha='right', fontsize=8)
plt.yticks(rotation=0, fontsize=8)
plt.tight_layout()
plt.show()

print("\n✅ Heatmap complete!")
print("💡 Diagonal = 1.0 (breed vs itself)")
print("💡 High values = visually similar breeds")
