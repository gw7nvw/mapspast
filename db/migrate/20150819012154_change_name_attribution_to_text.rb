class ChangeNameAttributionToText < ActiveRecord::Migration
def up
    change_column :mapsheets, :details, :text
    change_column :uploadedmaps, :attribution, :text
end
def down
    # This might cause trouble if you have strings longer
    # than 255 characters.
    change_column :mapsheets, :details, :string
    change_column :uploadedmaps, :attribution, :string
end
end
