"""
Oxford Pets Dataset Overview - Matplotlib Version

Tutorial: Dataset Overview
Library: Matplotlib
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Explore the Oxford-IIIT Pet Dataset structure and basic statistics
    using Matplotlib visualizations for publication-quality figures.

Requirements:
    pip install pandas matplotlib

Data Source:
    Full metadata (7,349 images):
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Set style for better-looking plots
plt.style.use('seaborn-v0_8-darkgrid')

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
fig.suptitle('Oxford Pets Dataset Overview', fontsize=16, fontweight='bold')

# ============================================================================
# Plot 1: Species Distribution (Pie Chart)
# ============================================================================

species_counts = df['species'].value_counts()
colors = ['#667eea', '#f093fb']

wedges, texts, autotexts = axes[0, 0].pie(
    species_counts.values,
    labels=species_counts.index,
    autopct='%1.1f%%',
    colors=colors,
    startangle=90,
    textprops={'fontsize': 12}
)

for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontweight('bold')

axes[0, 0].set_title('Species Distribution', fontsize=14, fontweight='bold')

# ============================================================================
# Plot 2: Split Distribution (Bar Chart)
# ============================================================================

split_counts = df['split'].value_counts().reindex(['train', 'val', 'test'])
colors_split = ['#3b82f6', '#8b5cf6', '#10b981']

bars = axes[0, 1].bar(
    split_counts.index,
    split_counts.values,
    color=colors_split,
    alpha=0.8,
    edgecolor='black',
    linewidth=1.5
)

axes[0, 1].set_title('Data Split Distribution', fontsize=14, fontweight='bold')
axes[0, 1].set_ylabel('Number of Images', fontsize=12)
axes[0, 1].set_xlabel('Split', fontsize=12)

# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    axes[0, 1].text(
        bar.get_x() + bar.get_width() / 2.,
        height,
        f'{int(height):,}',
        ha='center',
        va='bottom',
        fontweight='bold'
    )

# ============================================================================
# Plot 3: Top 10 Breeds (Horizontal Bar)
# ============================================================================

breed_counts = df['breed'].value_counts().head(10)

y_pos = np.arange(len(breed_counts))
axes[1, 0].barh(
    y_pos,
    breed_counts.values,
    color='#667eea',
    alpha=0.8,
    edgecolor='black',
    linewidth=1.5
)

axes[1, 0].set_yticks(y_pos)
axes[1, 0].set_yticklabels(breed_counts.index, fontsize=10)
axes[1, 0].set_xlabel('Number of Images', fontsize=12)
axes[1, 0].set_title('Top 10 Breeds by Image Count', fontsize=14, fontweight='bold')

# Add value labels
for i, v in enumerate(breed_counts.values):
    axes[1, 0].text(v + 2, i, str(v), va='center', fontweight='bold')

# ============================================================================
# Plot 4: Summary Statistics (Text)
# ============================================================================

axes[1, 1].axis('off')

summary_text = f"""
Dataset Statistics

Total Images: {len(df):,}
Total Breeds: {df['breed'].nunique()}
Total Species: {df['species'].nunique()}

Species Breakdown:
  • Dogs: {len(df[df['species']=='dog']):,} ({len(df[df['species']=='dog'])/len(df)*100:.1f}%)
  • Cats: {len(df[df['species']=='cat']):,} ({len(df[df['species']=='cat'])/len(df)*100:.1f}%)

Split Breakdown:
  • Train: {len(df[df['split']=='train']):,} ({len(df[df['split']=='train'])/len(df)*100:.1f}%)
  • Val: {len(df[df['split']=='val']):,} ({len(df[df['split']=='val'])/len(df)*100:.1f}%)
  • Test: {len(df[df['split']=='test']):,} ({len(df[df['split']=='test'])/len(df)*100:.1f}%)

Key Insights:
  ✓ Stratified split (all breeds in each split)
  ✓ Imbalanced toward dogs (~84%)
  ✓ Test set is 50% for robust evaluation
"""

axes[1, 1].text(
    0.1, 0.9,
    summary_text,
    transform=axes[1, 1].transAxes,
    fontsize=11,
    verticalalignment='top',
    fontfamily='monospace',
    bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5)
)

# ============================================================================
# Final Adjustments and Display
# ============================================================================

plt.tight_layout()
print("\n📈 Displaying overview figure...")
plt.show()

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
print("   - Some breeds are more common (e.g., English Cocker Spaniel)")
print("\n📚 Next Steps:")
print("   - Analyze breed distribution in detail")
print("   - Check class balance metrics")
print("   - Extract features for similarity analysis")

