class Do_publish
  @queue = :sleep
 
  def self.perform(map_id)
      puts "start"
      map=Uploadedmap.find_by_id(map_id)
      success=map.push_to_storage

      if success then
        map.mapstatus=Mapstatus.find_by(:name => "published")
        map.save
      end
  end 

end

