"""Oxford Pets Pixel Distribution - Matplotlib
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/pixel_distribution.csv
"""
import pandas as pd
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'pixel_distribution.csv')

df.set_index('breed')[['fg_percentage_mean', 'boundary_percentage_mean', 'bg_percentage_mean']].plot(kind='bar', stacked=True, figsize=(14, 6))
plt.title('Pixel Distribution by Breed')
plt.ylabel('Percentage')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
