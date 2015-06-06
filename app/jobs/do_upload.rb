class Do_upload
  @queue = :sleep
 
  def self.perform(map_id)
      puts "start"
      map=Uploadedmap.find_by_id(map_id)
      extension=map.url.split('.').last 
      map.filename=map.id.to_s+"."+extension
      map.save
      
      success=map.do_upload
     if success then map.mapstatus=Mapstatus.find_by(:name => "uploaded")
     else map.mapstatus=Mapstatus.find_by(:name => "new")
     end
     map.save

     puts "uploaded"

     if !map.is_tiff? then
       map.mapstatus=Mapstatus.find_by(:name => "converting ...")
       map.save
       success=map.do_convert_to_tiff
       if success then map.mapstatus=Mapstatus.find_by(:name => "converted")
       else map.mapstatus=Mapstatus.find_by(:name => "new")
       end
     else
       map.mapstatus=Mapstatus.find_by(:name => "converted")
     end
     map.save

     puts "converted"

     if map.is_geotiff? then
        map.get_all_from_gtiff
     else
        map.get_size_from_gtiff
     end
     puts "queried"
     map.save

     map.do_write_mapfile
  end
end

