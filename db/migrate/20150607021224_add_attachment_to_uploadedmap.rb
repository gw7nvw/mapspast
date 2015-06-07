class AddAttachmentToUploadedmap < ActiveRecord::Migration
  def self.up
    change_table :uploadedmaps do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :uploadedmaps, :image
  end

end
