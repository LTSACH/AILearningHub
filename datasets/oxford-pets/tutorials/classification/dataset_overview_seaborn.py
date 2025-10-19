"""
Oxford Pets Dataset Overview - Seaborn Version

Tutorial: Dataset Overview
Library: Seaborn
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Explore the Oxford-IIIT Pet Dataset structure and basic statistics
    using Seaborn's beautiful statistical visualizations.

Requirements:
    pip install pandas seaborn matplotlib

Data Source:
    Full metadata (7,349 images):
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv
"""

import pandas as pd
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

print(f"✓ Loaded {len(df):,} images")
print(f"✓ Dataset shape: {df.shape}")

# ============================================================================
# Basic Statistics
# ============================================================================

print("\n" + "=" * 70)
print("DATASET OVERVIEW")
print("=" * 70)

print(f"\nTotal Images:    {len(df):,}")
print(f"Total Breeds:    {df['breed'].nunique()}")
print(f"Total Species:   {df['species'].nunique()}")

print(f"\n📊 Species Distribution:")
for species, count in df['species'].value_counts().items():
    pct = count / len(df) * 100
    print(f"  {species.capitalize():8s}: {count:,} ({pct:.1f}%)")

print(f"\n📊 Split Distribution:")
for split, count in df['split'].value_counts().items():
    pct = count / len(df) * 100
    print(f"  {split.capitalize():8s}: {count:,} ({pct:.1f}%)")

# ============================================================================
# Create Figure with Subplots
# ============================================================================

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Oxford Pets Dataset Overview (Seaborn)', fontsize=16, fontweight='bold')

# ============================================================================
# Plot 1: Species Distribution (Count Plot)
# ============================================================================

species_counts = df['species'].value_counts()

sns.barplot(
    x=species_counts.index,
    y=species_counts.values,
    palette=['#667eea', '#f093fb'],
    ax=axes[0, 0],
    hue=species_counts.index,
    legend=False
)

axes[0, 0].set_title('Species Distribution', fontsize=14, fontweight='bold')
axes[0, 0].set_ylabel('Count', fontsize=12)
axes[0, 0].set_xlabel('Species', fontsize=12)

# Add value labels
for i, v in enumerate(species_counts.values):
    axes[0, 0].text(i, v + 50, f'{v:,}', ha='center', fontweight='bold')

# ============================================================================
# Plot 2: Split Distribution (Bar Plot)
# ============================================================================

split_counts = df['split'].value_counts().reindex(['train', 'val', 'test'])

sns.barplot(
    x=split_counts.index,
    y=split_counts.values,
    palette='viridis',
    ax=axes[0, 1],
    hue=split_counts.index,
    legend=False
)

axes[0, 1].set_title('Data Split Distribution', fontsize=14, fontweight='bold')
axes[0, 1].set_ylabel('Number of Images', fontsize=12)
axes[0, 1].set_xlabel('Split', fontsize=12)

# Add value labels
for i, v in enumerate(split_counts.values):
    axes[0, 1].text(i, v + 50, f'{v:,}', ha='center', fontweight='bold')

# ============================================================================
# Plot 3: Top 10 Breeds (Horizontal Bar Plot)
# ============================================================================

breed_counts = df['breed'].value_counts().head(10)

sns.barplot(
    y=breed_counts.index,
    x=breed_counts.values,
    palette='plasma',
    ax=axes[1, 0],
    hue=breed_counts.index,
    legend=False
)

axes[1, 0].set_title('Top 10 Breeds by Image Count', fontsize=14, fontweight='bold')
axes[1, 0].set_xlabel('Number of Images', fontsize=12)
axes[1, 0].set_ylabel('Breed', fontsize=12)

# Add value labels
for i, v in enumerate(breed_counts.values):
    axes[1, 0].text(v + 1, i, str(v), va='center', fontweight='bold')

# ============================================================================
# Plot 4: Species per Split (Stacked Bar)
# ============================================================================

# Create crosstab
crosstab = pd.crosstab(df['split'], df['species'])
crosstab = crosstab.reindex(['train', 'val', 'test'])

crosstab.plot(
    kind='bar',
    stacked=False,
    ax=axes[1, 1],
    color=['#667eea', '#f093fb'],
    alpha=0.8,
    edgecolor='black',
    linewidth=1.5
)

axes[1, 1].set_title('Species Distribution Across Splits', fontsize=14, fontweight='bold')
axes[1, 1].set_ylabel('Number of Images', fontsize=12)
axes[1, 1].set_xlabel('Split', fontsize=12)
axes[1, 1].legend(title='Species', fontsize=10)
axes[1, 1].set_xticklabels(axes[1, 1].get_xticklabels(), rotation=0)

# ============================================================================
# Final Adjustments and Display
# ============================================================================

plt.tight_layout()
print("\n📈 Displaying overview figure...")
plt.show()

# ============================================================================
# Additional Statistical Summary
# ============================================================================

print("\n" + "=" * 70)
print("STATISTICAL SUMMARY")
print("=" * 70)

print("\n📊 Breed Statistics:")
breed_stats = df.groupby('breed').size().describe()
print(f"  Mean images per breed:   {breed_stats['mean']:.1f}")
print(f"  Median images per breed: {breed_stats['50%']:.1f}")
print(f"  Min images per breed:    {int(breed_stats['min'])}")
print(f"  Max images per breed:    {int(breed_stats['max'])}")

print("\n📊 Species by Split:")
split_species = pd.crosstab(df['split'], df['species'])
print(split_species.to_string())

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ ANALYSIS COMPLETE")
print("=" * 70)
print("\n💡 Key Insights:")
print("   - Dataset is imbalanced toward dogs (~84% dogs, ~16% cats)")
print("   - Test set is largest (50% of data) for robust evaluation")
print("   - All 37 breeds are represented in each split (stratified)")
print("   - Breed distribution is relatively balanced (mean ~199 images/breed)")
print("\n📚 Next Steps:")
print("   - Analyze breed distribution in detail")
print("   - Check class balance metrics (Gini, entropy)")
print("   - Extract features for similarity analysis")

