// Load country boundaries from LSIB.

    var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
    
// Load wdpa collection
    var wdpa = ee.FeatureCollection("WCMC/WDPA/current/polygons")

// Get a feature collection with just the Country feature.

    var country = countries.filter(ee.Filter.eq('country_na', 'Israel'));


//Select only PA polygons within specified country

        var protectedareas = wdpa.filter(ee.Filter.rangeContains('STATUS_YR', 2023));
    var AOI = protectedareas.filterBounds(country.first().geometry());

// Get the loss image.

    var gfc2017 = ee.Image('UMD/hansen/global_forest_change_2017_v1_5');
    var lossImage = gfc2017.select(['loss']);
    var lossAreaImage = lossImage.multiply(ee.Image.pixelArea());


    var lossYear = gfc2017.select(['lossyear']);
    var lossByYear = lossAreaImage.addBands(lossYear).reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 1
        }),
      geometry: AOI,
      scale: 30,
      maxPixels: 1e9
    });

// Saved in list called 'group'
var statsFormattedProtected = ee.List(lossByYear.get('groups'))
  .map(function(el) {
    var d = ee.Dictionary(el);
    return [ee.Number(d.get('group')).format("20%02d"), d.get('sum')];
  });
var statsDictionaryProtected = ee.Dictionary(statsFormattedProtected.flatten());

// Create Bar chart for data visualization
var chartProtected = ui.Chart.array.values({
  array: statsDictionaryProtected.values(),
  axis: 0,
  xLabels: statsDictionaryProtected.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Yearly Forest Loss in Protected Areas in Israel',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });

print(chartProtected);
