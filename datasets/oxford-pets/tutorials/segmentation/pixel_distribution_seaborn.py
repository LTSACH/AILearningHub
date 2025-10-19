"""Oxford Pets Pixel Distribution - Seaborn
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/pixel_distribution.csv
"""
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'pixel_distribution.csv')

plt.figure(figsize=(12, 6))
sns.barplot(data=df.head(15), x='breed', y='fg_percentage_mean')
plt.title('Foreground Percentage (Top 15 Breeds)')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
