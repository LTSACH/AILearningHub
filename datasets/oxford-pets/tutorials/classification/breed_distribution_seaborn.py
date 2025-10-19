"""
Oxford Pets Breed Distribution Analysis - Seaborn Version

Tutorial: Breed Distribution
Library: Seaborn
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Analyze the distribution of 37 breeds and check class balance
    using Seaborn's beautiful statistical visualizations.

Requirements:
    pip install pandas numpy seaborn matplotlib

Data Source:
    Full metadata (7,349 images):
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv
"""

import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# Set Seaborn style
sns.set_theme(style="whitegrid", palette="husl")
sns.set_context("notebook", font_scale=1.1)

# ============================================================================
# Load Data
# ============================================================================

print("📊 Loading Oxford Pets Dataset...")
print("=" * 70)

url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv'
df = pd.read_csv(url)

print(f"✓ Loaded {len(df):,} images across {df['breed'].nunique()} breeds")

# ============================================================================
# Prepare Data
# ============================================================================

# Count images per breed
breed_df = df.groupby(['breed', 'species']).size().reset_index(name='count')
breed_df = breed_df.sort_values('count', ascending=False)

print(f"\n📊 Dataset Summary:")
print(f"  Total breeds: {len(breed_df)}")
print(f"  Cat breeds:   {len(breed_df[breed_df['species']=='cat'])}")
print(f"  Dog breeds:   {len(breed_df[breed_df['species']=='dog'])}")

# ============================================================================
# Class Balance Metrics
# ============================================================================

def calculate_gini(counts):
    sorted_counts = np.sort(counts)
    n = len(counts)
    cumsum = np.cumsum(sorted_counts)
    return (2 * np.sum((np.arange(1, n+1)) * sorted_counts)) / (n * cumsum[-1]) - (n + 1) / n

gini = calculate_gini(breed_df['count'].values)

print(f"\n📊 Balance Metrics:")
print(f"  Mean:   {breed_df['count'].mean():.1f} images/breed")
print(f"  Median: {breed_df['count'].median():.1f} images/breed")
print(f"  Gini:   {gini:.4f} (lower is better)")

# ============================================================================
# Create Figure
# ============================================================================

fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Oxford Pets: Breed Distribution Analysis (Seaborn)', 
             fontsize=16, fontweight='bold')

# ============================================================================
# Plot 1: Breed Counts (Top 20)
# ============================================================================

top_20 = breed_df.head(20)

sns.barplot(
    data=top_20,
    y='breed',
    x='count',
    hue='species',
    palette={'cat': '#667eea', 'dog': '#f093fb'},
    ax=axes[0, 0],
    dodge=False
)

axes[0, 0].set_title('Top 20 Breeds by Image Count', fontsize=12, fontweight='bold')
axes[0, 0].set_xlabel('Number of Images', fontsize=11)
axes[0, 0].set_ylabel('Breed', fontsize=11)
axes[0, 0].legend(title='Species', fontsize=10)

# ============================================================================
# Plot 2: Distribution Summary (Violin + Box)
# ============================================================================

sns.violinplot(
    data=breed_df,
    y='count',
    color='#667eea',
    alpha=0.6,
    ax=axes[0, 1],
    inner=None
)

sns.boxplot(
    data=breed_df,
    y='count',
    color='#f093fb',
    width=0.3,
    ax=axes[0, 1],
    showcaps=True,
    boxprops={'facecolor': '#f093fb', 'alpha': 0.8},
    medianprops={'color': 'red', 'linewidth': 2}
)

axes[0, 1].set_title('Class Balance Distribution', fontsize=12, fontweight='bold')
axes[0, 1].set_ylabel('Number of Images', fontsize=11)
axes[0, 1].set_xlabel('')

# ============================================================================
# Plot 3: Histogram with KDE
# ============================================================================

sns.histplot(
    data=breed_df,
    x='count',
    bins=15,
    kde=True,
    color='#667eea',
    alpha=0.6,
    ax=axes[1, 0],
    edgecolor='black',
    linewidth=1.5
)

axes[1, 0].axvline(breed_df['count'].mean(), color='red', linestyle='--', 
                   linewidth=2, label=f"Mean: {breed_df['count'].mean():.1f}")
axes[1, 0].axvline(breed_df['count'].median(), color='green', linestyle='--', 
                   linewidth=2, label=f"Median: {breed_df['count'].median():.1f}")

axes[1, 0].set_title('Image Count Distribution', fontsize=12, fontweight='bold')
axes[1, 0].set_xlabel('Number of Images per Breed', fontsize=11)
axes[1, 0].set_ylabel('Frequency', fontsize=11)
axes[1, 0].legend(fontsize=10)

# ============================================================================
# Plot 4: Species Comparison
# ============================================================================

cat_df = breed_df[breed_df['species'] == 'cat']
dog_df = breed_df[breed_df['species'] == 'dog']

# Prepare data for comparison
comparison_data = pd.DataFrame({
    'Species': ['Cat']*len(cat_df) + ['Dog']*len(dog_df),
    'Image Count': list(cat_df['count']) + list(dog_df['count'])
})

sns.boxplot(
    data=comparison_data,
    x='Species',
    y='Image Count',
    palette={'Cat': '#667eea', 'Dog': '#f093fb'},
    ax=axes[1, 1],
    width=0.5
)

sns.swarmplot(
    data=comparison_data,
    x='Species',
    y='Image Count',
    color='black',
    alpha=0.5,
    size=4,
    ax=axes[1, 1]
)

axes[1, 1].set_title('Breed Distribution by Species', fontsize=12, fontweight='bold')
axes[1, 1].set_ylabel('Number of Images per Breed', fontsize=11)
axes[1, 1].set_xlabel('Species', fontsize=11)

# ============================================================================
# Final Adjustments
# ============================================================================

plt.tight_layout()
print("\n📈 Displaying breed distribution analysis...")
plt.show()

# ============================================================================
# Statistical Summary
# ============================================================================

print("\n" + "=" * 70)
print("STATISTICAL SUMMARY")
print("=" * 70)

print("\n📊 Overall Statistics:")
print(breed_df['count'].describe().to_string())

print("\n📊 By Species:")
print("\nCats:")
print(f"  Breeds: {len(cat_df)}")
print(f"  Mean:   {cat_df['count'].mean():.1f} images/breed")
print(f"  Median: {cat_df['count'].median():.1f} images/breed")

print("\nDogs:")
print(f"  Breeds: {len(dog_df)}")
print(f"  Mean:   {dog_df['count'].mean():.1f} images/breed")
print(f"  Median: {dog_df['count'].median():.1f} images/breed")

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ ANALYSIS COMPLETE")
print("=" * 70)
print("\n💡 Key Insights:")
print(f"   - Well-balanced dataset (Gini={gini:.3f})")
print(f"   - Consistent breed representation")
print(f"   - Good for multi-class classification")

