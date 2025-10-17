# Sample Annotations

Annotations for 370 representative sample images in multiple formats.

## Available Formats

| Format | Tasks | Files | Size | Best For |
|--------|-------|-------|------|----------|
| **YOLO** | Classification, Detection, Segmentation, Unified | 370×4 labels | ~3 MB | YOLO training |
| **COCO** | Detection + Segmentation | 1 JSON | ~200 KB | PyTorch, Detectron2 |
| **CSV** | All tasks | 3 CSV files | ~100 KB | Analysis, pandas |

## Quick Start

### YOLO Classification (37 breeds)
```python
from ultralytics import YOLO
model = YOLO('yolov8n-cls.pt')
model.train(data='yolo/classification/data.yaml', epochs=100)
```

### YOLO Detection (bbox)
```python
model = YOLO('yolov8n.pt')
model.train(data='yolo/detection/data.yaml', epochs=100)
```

### YOLO Segmentation (mask)
```python
model = YOLO('yolov8n-seg.pt')
model.train(data='yolo/segmentation/data.yaml', epochs=100)
```

### YOLO Unified (bbox + mask) ⭐ RECOMMENDED
```python
model = YOLO('yolov8n-seg.pt')
model.train(data='yolo/unified/data.yaml', epochs=100)
```

### COCO Format (PyTorch)
```python
from detectron2.data import DatasetCatalog
register_coco_instances(
    "pets_sample", {},
    "coco/annotations/instances_sample.json",
    "../sample_images"
)
```

### CSV Format (Analysis)
```python
import pandas as pd
bboxes = pd.read_csv('csv/bboxes.csv')
masks = pd.read_csv('csv/trimaps_stats.csv')
```

## Dataset Scope

- **Images**: 370 samples (from `../sample_images/`)
- **Breeds**: 37 classes
- **Species**: Cats (120), Dogs (250)
- **Annotations**: Detection (370), Segmentation (370), Classification (370)

## Attribution

Oxford-IIIT Pet Dataset (Parkhi et al., 2012)
https://www.robots.ox.ac.uk/~vgg/data/pets/

Educational/demonstration purposes only.
