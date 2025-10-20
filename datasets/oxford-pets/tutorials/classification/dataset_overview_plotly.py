"""
Classification EDA - Dataset Overview (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_classification.html

Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
import pandas as pd

print("="*70)
print("📊 CLASSIFICATION EDA - Dataset Overview (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading dataset metadata from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/data/full_metadata.csv'
df = pd.read_csv(url)
print(f"   ✓ Loaded {len(df):,} images")
print(f"   ✓ Columns: {list(df.columns[:10])}")

# ============================================================================
# 2. DATASET OVERVIEW STATISTICS
# ============================================================================
print("\n2️⃣ Computing overview statistics...")

total_images = len(df)
num_breeds = df['breed'].nunique()
num_species = df['species'].nunique()

# Count by species
species_counts = df['species'].value_counts().to_dict()

# Count by split
split_counts = df['split'].value_counts().to_dict()

print(f"   ✓ Total: {total_images:,} images")
print(f"   ✓ Breeds: {num_breeds}")
print(f"   ✓ Species: {num_species}")

# ============================================================================
# 3. CHART 1: Species Distribution Pie Chart
# ============================================================================
print("\n3️⃣ Creating Species Distribution Pie Chart...")

# Colors matching web report
species_colors = {'cat': '#667eea', 'dog': '#f093fb'}  # Blue-purple for cats, Pink for dogs

fig1 = go.Figure(data=[go.Pie(
    labels=[s.capitalize() for s in species_counts.keys()],
    values=list(species_counts.values()),
    marker=dict(
        colors=[species_colors.get(s, '#10b981') for s in species_counts.keys()],
        line=dict(width=2, color='white')
    ),
    textinfo='label+percent',
    textposition='outside',
    hovertemplate='<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
)])

fig1.update_layout(
    title=dict(
        text="Species Distribution",
        font=dict(size=18, family='Arial, sans-serif')
    ),
    showlegend=True,
    legend=dict(
        orientation='v',
        yanchor='middle',
        y=0.5,
        xanchor='left',
        x=1.02
    ),
    margin=dict(t=60, r=100, b=20, l=20),
    height=400
)

print("   ✓ Species pie chart created")
fig1.show()

# ============================================================================
# 4. CHART 2: Train/Val/Test Split Distribution
# ============================================================================
print("\n4️⃣ Creating Split Distribution Chart...")

split_colors = {
    'train': '#3b82f6',  # Blue
    'val': '#10b981',    # Green
    'test': '#f59e0b'    # Orange
}

split_data = []
for split_name in ['train', 'val', 'test']:
    split_df = df[df['split'] == split_name]
    species_split = split_df['species'].value_counts().to_dict()
    
    for species in ['cat', 'dog']:
        count = species_split.get(species, 0)
        split_data.append({
            'Species': species.capitalize(),
            'Split': split_name.capitalize(),
            'Count': count
        })

split_df_chart = pd.DataFrame(split_data)

fig2 = go.Figure()

for split_name in ['train', 'val', 'test']:
    split_subset = split_df_chart[split_df_chart['Split'] == split_name.capitalize()]
    
    fig2.add_trace(go.Bar(
        x=split_subset['Species'],
        y=split_subset['Count'],
        name=split_name.capitalize(),
        marker_color=split_colors[split_name],
        hovertemplate='<b>%{x}</b><br>' + split_name.capitalize() + ': %{y}<extra></extra>'
    ))

fig2.update_layout(
    title="Train/Val/Test Split by Species",
    xaxis_title="Species",
    yaxis_title="Count",
    barmode='group',
    template="plotly_white",
    height=400,
    showlegend=True,
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="right",
        x=1
    )
)

print("   ✓ Split distribution chart created")
fig2.show()

# ============================================================================
# 5. STATISTICS SUMMARY
# ============================================================================
print("\n5️⃣ Statistics Summary:")
print("="*70)

print(f"📊 Dataset Overview:")
print(f"   • Total Images: {total_images:,}")
print(f"   • Number of Breeds: {num_breeds}")
print(f"   • Number of Species: {num_species}")

print(f"\n🐱🐶 Species Distribution:")
for species, count in species_counts.items():
    percentage = (count / total_images) * 100
    print(f"   • {species.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n📚 Split Distribution:")
for split_name, count in sorted(split_counts.items()):
    percentage = (count / total_images) * 100
    print(f"   • {split_name.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n🏷️ Top 10 Breeds:")
top_breeds = df['breed'].value_counts().head(10)
for breed, count in top_breeds.items():
    breed_display = breed.replace('_', ' ').title()
    percentage = (count / total_images) * 100
    print(f"   • {breed_display}: {count} ({percentage:.1f}%)")

print("="*70)
print("✅ Dataset overview complete! Charts match web report.")
