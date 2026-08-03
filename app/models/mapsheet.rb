class Mapsheet < ActiveRecord::Base

def create_polygon()
  fromproj4s= Projection.find_by_id(self.source_srid).proj4
  toproj4s=  Projection.find_by_id(4326).proj4

  fromproj=RGeo::CoordSys::Proj4.new(fromproj4s)
  toproj=RGeo::CoordSys::Proj4.new(toproj4s)

  topleft=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.xleft, self.ytop))
  topright=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.xright, self.ytop))
  bottomleft=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.xleft, self.ybottom))
  bottomright=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.xright, self.ybottom))

  self.extent="POLYGON (("+topleft+","+topright+","+bottomright+","+bottomleft+","+topleft+"))"
  
end

def self.create_missing_polygons()
  mapsheets=Mapsheet.find_by_sql [ "select * from mapsheets where extent is null" ]
  mapsheets.each do |ms|
    ms.create_polygon
    ms.save
  end
end

def self.find_by_point(x,y, srid, series_id)
# Force traditional X=Lon, Y=Lat calculation rules via custom string mappings
# (Notice the +type=crs flag at the end)
fromproj = RGeo::CoordSys::Proj4.create(srid.to_i)
toproj   = RGeo::CoordSys::Proj4.create(4326)

# This transformation calculation will now output correct NZ coordinates exactly like your old server
pointarr = RGeo::CoordSys::Proj4.transform_coords(fromproj, toproj, x.to_f, y.to_f)
# Now you can read the attributes cleanly:
# target_point.x or target_point.y 
if  pointarr and pointarr.length>1
      if series_id and series_id>0 then
        Mapsheet.find_by_sql [ "select * from mapsheets where series_id = ? and ST_Contains(extent, ST_GeomFromText( 'POINT(? ?)',4326));", series_id, pointarr[0],pointarr[1]] 
      else
        Mapsheet.find_by_sql [ "select min(id), name, year_printed, series, sheet, year_revised, edition, scale from mapsheets where ST_Contains(extent, ST_GeomFromText( 'POINT(? ?)',4326)) group by name, edition, year_printed, year_revised, series, scale,sheet  order by year_printed desc;", pointarr[0],pointarr[1]] 
      end
   end

end

def arr_to_s(arr)
  text=""
  arr.each do |a|
    text=text+" "+a.to_s
  end
  text[1..-1]
end

end
