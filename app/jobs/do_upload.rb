class Do_upload
  @queue = :sleep
 
  def self.perform(map_id)
     puts "start"
     map=Uploadedmap.find_by_id(map_id)
     success=true
     if map.url and map.url.length>0 then
        extension=map.url.split('.').last 
        map.filename=map.id.to_s+"."+extension
        map.save
      
        success=map.do_upload
     else
        extension=map.image_file_name.split('.').last
        map.filename=map.id.to_s+"."+extension
        map.save
     end

     if !success then 
        puts "Upload failed"
        map.mapstatus=Mapstatus.find_by(:name => "new")
        map.errortext="Failed to upload file from the specified URL"
        map.save
     end


     if success 
       puts "uploaded"
       if !map.is_tiff? then
         map.mapstatus=Mapstatus.find_by(:name => "converting ...")
         map.save
         success=map.do_convert_to_tiff
         if success then map.mapstatus=Mapstatus.find_by(:name => "converted")
         end
       else
         map.mapstatus=Mapstatus.find_by(:name => "converted")
       end
       map.save
     end

     if !success
        puts "convert failed"
        map.mapstatus=Mapstatus.find_by(:name => "new")
        map.errortext="Specified file could not be converted to a TIFF. Is it an image?"
        map.save
     end

     if success then 
       puts "converted"
       if map.is_geotiff? then
        map.get_all_from_gtiff
       else
        map.get_size_from_gtiff
       end
       puts "queried"
       map.save
     end

     if success then map.do_write_mapfile end
  end
end

