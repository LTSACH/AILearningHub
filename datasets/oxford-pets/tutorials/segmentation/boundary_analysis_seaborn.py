"""Oxford Pets Boundary Analysis - Seaborn
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/mask_statistics.csv
"""
import pandas as pd

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'mask_statistics.csv')

print(f"Loaded {len(df):,} masks")
print(f"Mean boundary: {df['boundary_percentage'].mean():.1f}%")
print("Note: Detailed boundary analysis coming in future updates")
