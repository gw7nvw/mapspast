class AddStatusToUploadedmap < ActiveRecord::Migration
  def change
    change_table :uploadedmaps do |t|
      t.integer :mapstatus_id  
    end
  end
end

