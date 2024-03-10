// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Subset the PHL feature from countries.
var phl = ee.Feature(
  countries
    .filter(ee.Filter.eq('country_na', 'Philippines'))
    .first()
);

// Subset protected areas to the bounds of the PHL feature
// and other criteria. Clip to the intersection with PHL.
var protectedAreas = ee.FeatureCollection('WCMC/WDPA/current/polygons')
  .filter(ee.Filter.and(
    ee.Filter.bounds(phl.geometry()),
    ee.Filter.neq('IUCN_CAT', 'Not reported'),         //filter not equal to 
    ee.Filter.eq('MARINE', 0),
    ee.Filter.lt('STATUS_YR', 2000)        // filter greater than
  ))
  .map(function(feat){              //map over each faeature for intersect with PHL boundary
    return phl.intersection(feat);
  });

// Get the loss image.
var gfc2022 = ee.Image("UMD/hansen/global_forest_change_2022_v1_10");
var lossIn2020 = gfc2022.select(['lossyear']).eq(20);
var areaImage = lossIn2020.multiply(ee.Image.pixelArea());

// Calculate the area of loss pixels in the phl.
var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: phl.geometry(),
  scale: 30,
  maxPixels: 1e9
});
print(
  'Area lost in the Philippines:',
  stats.get('lossyear'),
  'square meters'
);

// Calculate the area of loss pixels in the protected areas.
var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: protectedAreas.geometry(),
  scale: 30,
  maxPixels: 1e9
});
print(
  'Area lost in protected areas:',
  stats.get('lossyear'),
  'square meters'
);