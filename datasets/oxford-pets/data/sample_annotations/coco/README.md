# COCO Format Annotations

Annotations in COCO format (Common Objects in Context).

## File

`annotations/instances_sample.json`

## Format

Standard COCO JSON with:
- `images`: 370 image entries
- `annotations`: 370 instance entries (bbox + segmentation)
- `categories`: 1 category (pet)

## Usage

### With Detectron2
```python
from detectron2.data import DatasetCatalog, MetadataCatalog
from detectron2.data.datasets import register_coco_instances

register_coco_instances(
    "pets_sample",
    {},
    "annotations/instances_sample.json",
    "../../sample_images"
)
```

### With PyTorch
```python
from pycocotools.coco import COCO

coco = COCO('annotations/instances_sample.json')
img_ids = coco.getImgIds()
anns = coco.loadAnns(coco.getAnnIds(imgIds=img_ids[0]))
```

## Attribution

Oxford-IIIT Pet Dataset (Parkhi et al., 2012)
