"""
Core EDA - Image Size Distribution Analysis (Matplotlib)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_core.html

Run this in Google Colab:
1. Copy & paste entire code
2. Run cell
3. See exact same charts as web report!
"""

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

print("="*70)
print("📊 CORE EDA - Image Size Distribution Analysis (Matplotlib)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading image statistics from GitHub Pages...")
url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/core/image_statistics.csv'
df = pd.read_csv(url)
print(f"   ✓ Loaded {len(df):,} images")

# Colors matching web report
colors = {'cat': '#f59e0b', 'dog': '#3b82f6'}  # Orange for cats, Blue for dogs

# ============================================================================
# 2. CREATE ALL CHARTS IN ONE FIGURE
# ============================================================================
print("\n2️⃣ Creating visualizations...")

fig = plt.figure(figsize=(16, 12))

# ----------------------------------------------------------------------------
# Chart 1: Size Distribution (Width vs Height Scatter)
# ----------------------------------------------------------------------------
ax1 = plt.subplot(2, 2, 1)

for species in df['species'].unique():
    species_data = df[df['species'] == species]
    ax1.scatter(
        species_data['width'],
        species_data['height'],
        c=colors.get(species, '#10b981'),
        s=30,
        alpha=0.6,
        edgecolors='white',
        linewidths=0.5,
        label=species.capitalize()
    )

ax1.set_xlabel('Width (pixels)', fontsize=12)
ax1.set_ylabel('Height (pixels)', fontsize=12)
ax1.set_title('Image Size Distribution (Width x Height)', fontsize=14, fontweight='bold')
ax1.grid(True, alpha=0.3, color='#f0f0f0')
ax1.legend(loc='upper left')
ax1.set_facecolor('white')

# ----------------------------------------------------------------------------
# Chart 2: File Size Distribution Histogram
# ----------------------------------------------------------------------------
ax2 = plt.subplot(2, 2, 2)

for species in df['species'].unique():
    species_data = df[df['species'] == species]
    ax2.hist(
        species_data['file_size_kb'],
        bins=30,
        alpha=0.7,
        color=colors.get(species, '#10b981'),
        label=species.capitalize(),
        edgecolor='white',
        linewidth=0.5
    )

ax2.set_xlabel('File Size (KB)', fontsize=12)
ax2.set_ylabel('Count', fontsize=12)
ax2.set_title('File Size Distribution', fontsize=14, fontweight='bold')
ax2.grid(True, alpha=0.3, color='#f0f0f0', axis='y')
ax2.legend()
ax2.set_facecolor('white')

# ----------------------------------------------------------------------------
# Chart 3: Aspect Ratio Distribution with Common Ratios
# ----------------------------------------------------------------------------
ax3 = plt.subplot(2, 2, 3)

for species in df['species'].unique():
    species_data = df[df['species'] == species]
    ax3.hist(
        species_data['aspect_ratio'],
        bins=30,
        alpha=0.7,
        color=colors.get(species, '#10b981'),
        label=species.capitalize(),
        edgecolor='white',
        linewidth=0.5
    )

# Add vertical lines for common aspect ratios
common_ratios = [0.75, 1.0, 1.33, 1.5, 2.0]
for ratio in common_ratios:
    ax3.axvline(x=ratio, color='red', linestyle='--', linewidth=1, alpha=0.7)
    ax3.text(ratio, ax3.get_ylim()[1]*0.95, f'{ratio}:1', 
             color='red', fontsize=9, ha='center', va='top')

ax3.set_xlabel('Aspect Ratio (Width/Height)', fontsize=12)
ax3.set_ylabel('Count', fontsize=12)
ax3.set_title('Aspect Ratio Distribution', fontsize=14, fontweight='bold')
ax3.grid(True, alpha=0.3, color='#f0f0f0', axis='y')
ax3.legend()
ax3.set_facecolor('white')

# ----------------------------------------------------------------------------
# Chart 4: Statistics Summary (Text Box)
# ----------------------------------------------------------------------------
ax4 = plt.subplot(2, 2, 4)
ax4.axis('off')

stats_text = f"""
📊 STATISTICS SUMMARY

Total Images: {len(df):,}
   • Cats: {len(df[df['species']=='cat']):,}
   • Dogs: {len(df[df['species']=='dog']):,}

📐 Dimensions:
   • Mean width: {df['width'].mean():.1f} px (±{df['width'].std():.1f})
   • Mean height: {df['height'].mean():.1f} px (±{df['height'].std():.1f})
   • Min size: {df['width'].min()} x {df['height'].min()} px
   • Max size: {df['width'].max()} x {df['height'].max()} px

💾 File Sizes:
   • Mean: {df['file_size_kb'].mean():.1f} KB
   • Median: {df['file_size_kb'].median():.1f} KB
   • Total: {df['file_size_kb'].sum()/1024:.1f} MB

📏 Aspect Ratios:
   • Mean: {df['aspect_ratio'].mean():.2f}
   • Median: {df['aspect_ratio'].median():.2f}
   • Range: {df['aspect_ratio'].min():.2f} - {df['aspect_ratio'].max():.2f}
"""

ax4.text(0.1, 0.5, stats_text, fontsize=11, verticalalignment='center',
         family='monospace', bbox=dict(boxstyle='round', facecolor='#f8f9fa', alpha=0.8))

# ============================================================================
# FINAL LAYOUT
# ============================================================================
plt.suptitle('Oxford Pets - Core EDA: Image Size Distribution Analysis', 
             fontsize=16, fontweight='bold', y=0.995)
plt.tight_layout(rect=[0, 0, 1, 0.99])
fig.patch.set_facecolor('white')

print("   ✓ All charts created")
plt.show()

# ============================================================================
# PRINT STATISTICS
# ============================================================================
print("\n" + "="*70)
print("📊 STATISTICS SUMMARY")
print("="*70)
print(f"Total Images: {len(df):,}")
print(f"   • Cats: {len(df[df['species']=='cat']):,}")
print(f"   • Dogs: {len(df[df['species']=='dog']):,}")
print(f"\n📐 Dimensions:")
print(f"   • Mean width: {df['width'].mean():.1f} px (std: {df['width'].std():.1f})")
print(f"   • Mean height: {df['height'].mean():.1f} px (std: {df['height'].std():.1f})")
print(f"\n💾 File Sizes:")
print(f"   • Mean: {df['file_size_kb'].mean():.1f} KB")
print(f"   • Total: {df['file_size_kb'].sum()/1024:.1f} MB")
print(f"\n📏 Aspect Ratios:")
print(f"   • Mean: {df['aspect_ratio'].mean():.2f}")
print(f"   • Median: {df['aspect_ratio'].median():.2f}")
print("="*70)
print("✅ Analysis complete! Charts match web report.")
