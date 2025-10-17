# CSV Format Annotations

Simple CSV tables for analysis and exploration.

## Files

1. **classification.csv** - Breed labels
2. **bboxes.csv** - Detection bounding boxes
3. **trimaps_stats.csv** - Segmentation mask statistics

## Usage

```python
import pandas as pd

# Load all
classification = pd.read_csv('classification.csv')
bboxes = pd.read_csv('bboxes.csv')
masks = pd.read_csv('trimaps_stats.csv')

# Analyze
bboxes.groupby('breed')['area'].mean()
masks.groupby('species')['fg_pct'].mean()
```

## Attribution

Oxford-IIIT Pet Dataset (Parkhi et al., 2012)
