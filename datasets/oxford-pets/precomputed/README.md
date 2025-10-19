# Pre-computed Statistics for Oxford Pets Dataset

This directory contains pre-computed statistics and features for the Oxford-IIIT Pet Dataset to enable instant tutorial execution without requiring heavy computation or GPU resources.

## 📂 Directory Structure

```
precomputed/
├── classification/
│   ├── breed_statistics.csv      # Basic statistics per breed
│   ├── tsne_coordinates.csv      # t-SNE 2D projections
│   ├── umap_coordinates.csv      # UMAP 2D projections
│   └── similarity_matrix.csv     # Breed similarity matrix (37×37)
├── detection/                     # (Future: Detection statistics)
└── segmentation/                  # (Future: Segmentation statistics)
```

## 📊 Classification Statistics

### `breed_statistics.csv`
Basic statistics for each of the 37 breeds.

**Columns:**
- `breed`: Breed name
- `total_images`: Total number of images
- `train_images`: Images in training set
- `val_images`: Images in validation set
- `test_images`: Images in test set
- `species`: Cat or dog

**Usage:**
```python
import pandas as pd
url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/breed_statistics.csv'
df = pd.read_csv(url)
```

### `tsne_coordinates.csv`
Pre-computed t-SNE 2D coordinates from ResNet50 features.

**Columns:**
- `image_name`: Image identifier
- `breed`: Breed name
- `species`: Cat or dog
- `tsne_x`: t-SNE dimension 1
- `tsne_y`: t-SNE dimension 2

**Parameters:** perplexity=30, n_iter=1000, random_state=42

### `umap_coordinates.csv`
Pre-computed UMAP 2D coordinates from ResNet50 features.

**Columns:**
- `image_name`: Image identifier
- `breed`: Breed name
- `species`: Cat or dog
- `umap_x`: UMAP dimension 1
- `umap_y`: UMAP dimension 2

**Parameters:** n_neighbors=15, min_dist=0.1, random_state=42

### `similarity_matrix.csv`
Cosine similarity matrix between breed feature representations (37×37).

**Format:** CSV with breed names as both index and columns

**Values:** Range [0, 1] where 1.0 = identical, 0.0 = completely different

## 🎯 Purpose

These pre-computed files enable:

1. **Instant Tutorial Execution**: Users can run tutorial code in seconds instead of minutes
2. **No GPU Required**: No need for expensive hardware to extract features
3. **Reproducibility**: Everyone gets the exact same results
4. **Learning Focus**: Focus on EDA concepts, not computation details

## 📚 Usage in Tutorials

Tutorial code examples load these files directly:

```python
# Example: Load t-SNE coordinates
import pandas as pd
import plotly.express as px

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/classification/'
tsne_df = pd.read_csv(base_url + 'tsne_coordinates.csv')

# Visualize immediately!
fig = px.scatter(tsne_df, x='tsne_x', y='tsne_y', color='breed')
fig.show()
```

## 🔧 Generation

These files are generated using:
- **Features**: ResNet50 (ImageNet pretrained)
- **Dimensionality Reduction**: scikit-learn (t-SNE, UMAP)
- **Similarity**: Cosine distance between breed-averaged features

To regenerate:
```bash
cd oxford_pets_classification
python scripts/precompute/generate_classification_stats.py
```

## 📝 License

Same as Oxford-IIIT Pet Dataset. See [ATTRIBUTION.md](../ATTRIBUTION.md).

