"""Oxford Pets Mask Quality - Seaborn
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/quality_metrics.csv
"""
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'quality_metrics.csv')
plt.figure(figsize=(12, 6))
sns.barplot(data=df.nlargest(15, 'count'), x='breed', y='avg_coverage', palette='viridis')
plt.title('Average Coverage by Breed')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
