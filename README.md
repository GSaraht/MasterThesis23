# MasterThesis23
Code used for my master thesis.

HTML_vis
- Map_no_slider.html
- Map_with_slider.html
- everything else, in folder came with the slider plugin

Java_GEE
- Tree_lossyear_ISRAEL_annual.js    	 -> JavaScriptAPI GEE, to extract tree loss in the country Israel
- Tree_lossyear_ISRAEL_PA_annual.js 	 -> JavaScriptAPI GEE, to extract tree loss in PAs in Israel
- Tree_lossyear_PHL_PA_2020.js	       -> JavaScriptAPI GEE, to extract tree loss in PAs in Israel for specific criterias
	
Python ETL
- 1_extract_transform_final.ipynb  -> extract geometries from API
- 2_point_data_merge.ipynb	       -> merge and transform point geometries with OG data
- 3_poly_data_merge.ipynb	         -> merge polygons with OG data
- 4_shp2geojson.ipynb		           -> reduce size and save as GeoJSON
- 5_data_exploration.ipynb	       -> Protected Areas Exploration


