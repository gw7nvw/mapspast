class Mapsheet < ActiveRecord::Base
set_rgeo_factory_for_column(:extent,
		RGeo::Geographic.spherical_factory(:srid => 4326))

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
   fromproj4s= Projection.find_by_id(srid).proj4
   toproj4s=  Projection.find_by_id(4326).proj4

   fromproj=RGeo::CoordSys::Proj4.new(fromproj4s)
   toproj=RGeo::CoordSys::Proj4.new(toproj4s)
 
   pointarr=RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,x, y)
 
   if pointarr and pointarr.count==2 then 
      if series_id and series_id>0 then
        Mapsheet.find_by_sql [ "select * from mapsheets where series_id = ? and ST_Contains(extent, ST_GeomFromText( 'POINT(? ?)',4326));", series_id, pointarr[0], pointarr[1]] 
      else
        Mapsheet.find_by_sql [ "select * from mapsheets where ST_Contains(extent, ST_GeomFromText( 'POINT(? ?)',4326)) order by year_published desc;", pointarr[0], pointarr[1]] 
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
