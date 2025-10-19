"""
Oxford Pets Breed Distribution Analysis - Matplotlib Version

Tutorial: Breed Distribution
Library: Matplotlib
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Analyze the distribution of 37 breeds and check class balance
    using Matplotlib for publication-quality figures.

Requirements:
    pip install pandas numpy matplotlib

Data Source:
    Full metadata (7,349 images):
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Set style
plt.style.use('seaborn-v0_8-darkgrid')

# ============================================================================
# Load Data
# ============================================================================

print("📊 Loading Oxford Pets Dataset...")
print("=" * 70)

url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/data/full_metadata.csv'
df = pd.read_csv(url)

print(f"✓ Loaded {len(df):,} images across {df['breed'].nunique()} breeds")

# ============================================================================
# Breed Distribution Analysis
# ============================================================================

print("\n" + "=" * 70)
print("BREED DISTRIBUTION ANALYSIS")
print("=" * 70)

breed_counts = df['breed'].value_counts()

print(f"\n📊 Overall Statistics:")
print(f"  Total breeds:        {len(breed_counts)}")
print(f"  Mean images/breed:   {breed_counts.mean():.1f}")
print(f"  Median images/breed: {breed_counts.median():.1f}")
print(f"  Min images/breed:    {breed_counts.min()}")
print(f"  Max images/breed:    {breed_counts.max()}")
print(f"  Std deviation:       {breed_counts.std():.1f}")

# ============================================================================
# Class Balance Metrics
# ============================================================================

def calculate_gini_coefficient(counts):
    sorted_counts = np.sort(counts)
    n = len(counts)
    cumsum = np.cumsum(sorted_counts)
    return (2 * np.sum((np.arange(1, n+1)) * sorted_counts)) / (n * cumsum[-1]) - (n + 1) / n

def calculate_entropy(counts):
    proportions = counts / counts.sum()
    return -np.sum(proportions * np.log2(proportions + 1e-10))

gini = calculate_gini_coefficient(breed_counts.values)
entropy = calculate_entropy(breed_counts.values)
max_entropy = np.log2(len(breed_counts))
normalized_entropy = entropy / max_entropy

print(f"\n📊 Class Balance Metrics:")
print(f"  Gini Coefficient:      {gini:.4f} (0=perfect balance, 1=perfect imbalance)")
print(f"  Entropy:               {entropy:.4f} bits")
print(f"  Normalized Entropy:    {normalized_entropy:.4f} (1=perfect balance)")

# ============================================================================
# Create Figure with Multiple Subplots
# ============================================================================

fig = plt.figure(figsize=(16, 10))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)

# ============================================================================
# Plot 1: All 37 Breeds Distribution (Horizontal Bar)
# ============================================================================

ax1 = fig.add_subplot(gs[0, :])

breed_counts_sorted = breed_counts.sort_values(ascending=True)
breed_species = df.groupby('breed')['species'].first()
colors = ['#667eea' if breed_species[breed] == 'cat' else '#f093fb' for breed in breed_counts_sorted.index]

y_pos = np.arange(len(breed_counts_sorted))
bars = ax1.barh(y_pos, breed_counts_sorted.values, color=colors, alpha=0.8, edgecolor='black', linewidth=0.5)

ax1.set_yticks(y_pos)
ax1.set_yticklabels(breed_counts_sorted.index, fontsize=8)
ax1.set_xlabel('Number of Images', fontsize=12, fontweight='bold')
ax1.set_title('Breed Distribution (All 37 Breeds)', fontsize=14, fontweight='bold', pad=20)
ax1.grid(axis='x', alpha=0.3)

# Add legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor='#667eea', label='Cat'),
                   Patch(facecolor='#f093fb', label='Dog')]
ax1.legend(handles=legend_elements, loc='lower right', fontsize=10)

# ============================================================================
# Plot 2: Distribution Statistics (Box Plot)
# ============================================================================

ax2 = fig.add_subplot(gs[1, 0])

bp = ax2.boxplot(breed_counts.values, vert=True, patch_artist=True,
                 boxprops=dict(facecolor='#667eea', alpha=0.7),
                 medianprops=dict(color='red', linewidth=2),
                 whiskerprops=dict(color='black', linewidth=1.5),
                 capprops=dict(color='black', linewidth=1.5))

ax2.set_ylabel('Number of Images', fontsize=12, fontweight='bold')
ax2.set_title('Class Balance Summary (Box Plot)', fontsize=12, fontweight='bold')
ax2.grid(axis='y', alpha=0.3)

# Add statistics text
stats_text = f'Mean: {breed_counts.mean():.1f}\nMedian: {breed_counts.median():.1f}\nStd: {breed_counts.std():.1f}\nGini: {gini:.3f}'
ax2.text(1.15, breed_counts.mean(), stats_text, fontsize=10, 
         bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

# ============================================================================
# Plot 3: Histogram of Image Counts
# ============================================================================

ax3 = fig.add_subplot(gs[1, 1])

n, bins, patches = ax3.hist(breed_counts.values, bins=15, color='#f093fb', 
                             alpha=0.7, edgecolor='black', linewidth=1.5)

ax3.set_xlabel('Number of Images per Breed', fontsize=12, fontweight='bold')
ax3.set_ylabel('Frequency', fontsize=12, fontweight='bold')
ax3.set_title('Image Count Distribution', fontsize=12, fontweight='bold')
ax3.grid(axis='y', alpha=0.3)

# Add vertical line for mean
ax3.axvline(breed_counts.mean(), color='red', linestyle='--', linewidth=2, 
            label=f'Mean: {breed_counts.mean():.1f}')
ax3.axvline(breed_counts.median(), color='green', linestyle='--', linewidth=2, 
            label=f'Median: {breed_counts.median():.1f}')
ax3.legend(fontsize=10)

# ============================================================================
# Final Adjustments
# ============================================================================

plt.suptitle('Oxford Pets: Breed Distribution Analysis', fontsize=16, fontweight='bold', y=0.995)
print("\n📈 Displaying breed distribution analysis...")
plt.show()

# ============================================================================
# Top and Bottom Breeds
# ============================================================================

print("\n" + "=" * 70)
print("TOP & BOTTOM BREEDS")
print("=" * 70)

print("\n📈 Top 5 Breeds (Most Images):")
for i, (breed, count) in enumerate(breed_counts.head(5).items(), 1):
    species = breed_species[breed]
    print(f"  {i}. {breed:30s} {count:3d} images ({species})")

print("\n📉 Bottom 5 Breeds (Fewest Images):")
for i, (breed, count) in enumerate(breed_counts.tail(5).items(), 1):
    species = breed_species[breed]
    print(f"  {i}. {breed:30s} {count:3d} images ({species})")

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ ANALYSIS COMPLETE")
print("=" * 70)
print("\n💡 Key Insights:")
print(f"   - Relatively balanced distribution (Gini={gini:.3f})")
print(f"   - Most breeds have {breed_counts.median():.0f}±{breed_counts.std():.0f} images")
print(f"   - Minimal class imbalance (good for training)")
print("\n📚 Next Steps:")
print("   - Extract features for breed similarity")
print("   - Identify visually similar breeds")

