# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
Mapseries.create(name: "NZMS1 1949", year_of_snapshot: 1949, series: "NZMS1", edition: nil, scale:63360, details: "Snapshot of the latest editions of the NZMS1 series as of the last day of 1949", createdBy_id: 1)
Mapseries.create(name: "NZMS1 1959", year_of_snapshot: 1959, series: "NZMS1", edition: nil, scale:63360, details: "Snapshot of the latest editions of the NZMS1 series as of the last day of 1959", createdBy_id: 1)
Mapseries.create(name: "NZMS1 1969", year_of_snapshot: 1969, series: "NZMS1", edition: nil, scale:63360, details: "Snapshot of the latest editions of the NZMS1 series as of the last day of 1969", createdBy_id: 1)
Mapseries.create(name: "NZMS1 1979", year_of_snapshot: 1979, series: "NZMS1", edition: nil, scale:63360, details: "Snapshot of the latest editions of the NZMS1 series as of the last day of 1979", createdBy_id: 1)
Mapseries.create(name: "NZMS1/260 1989", year_of_snapshot: 1989, series: "NZMS1/260", edition: nil, scale:50000, details: "Snapshot of the latest editions of the NZMS260 (where available) or NZMS1 series as of the last day of 1989", createdBy_id: 1)
Mapseries.create(name: "NZMS260 1999", year_of_snapshot: 1999, series: "NZMS260", edition: nil, scale:50000, details: "Snapshot of the latest editions of the NZMS260 series as of the last day of 1999", createdBy_id: 1)
Mapseries.create(name: "Topo50 2009", year_of_snapshot: 2009, series: "Topo50", edition: nil, scale:50000, details: "Snapshot of the first editions of the Topo50 series in 1999", createdBy_id: 1)
Projection.create(id: 2193, name: "NZTM2000", proj4: "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towg", wkt: "", epsg: 2193)
Projection.create(id: 4326, name: "WGS84", proj4: "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", wkt: "", epsg: 4326)
Projection.create(id: 27200, name: "NZMG49", proj4: "+proj=nzmg +lat_0=-41 +lon_0=173 +x_0=2510000 +y_0=6023150 +ellps=intl +datum=nzgd49 +units=m +no_defs", wkt: "", epsg: 27200)
Projection.create(id: 900913, name: "GOOGLE", proj4: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs", wkt: "", epsg: 900913)
Projection.create(id: 27291, name: "NIYG", proj4: "+proj=tmerc +lat_0=-39 +lon_0=175.5 +k=1 +x_0=274319.5243848086 +y_0=365759.3658464114 +ellps=intl +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs", wkt: "", epsg: 27291)
Projection.create(id: 27292, name: "SIYG", proj4: "+proj=tmerc +lat_0=-44 +lon_0=171.5 +k=1 +x_0=457199.2073080143 +y_0=457199.2073080143 +ellps=intl +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs", wkt: "", epsg: 27292)
