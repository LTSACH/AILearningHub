"""Oxford Pets Mask Quality - Matplotlib
Data: https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/quality_metrics.csv
"""
import pandas as pd
import matplotlib.pyplot as plt

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/segmentation/'
df = pd.read_csv(base_url + 'quality_metrics.csv')
df.nlargest(15, 'count').plot(x='breed', y='coverage_cv', kind='bar', figsize=(12, 6), color='#10b981')
plt.title('Coverage Consistency')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
