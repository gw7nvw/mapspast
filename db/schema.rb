# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170729113323) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"
  enable_extension "postgis_topology"

  create_table "authlists", force: true do |t|
    t.string   "address"
    t.string   "name"
    t.boolean  "allow",       default: false
    t.boolean  "forbid",      default: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "auth_digest"
  end

  create_table "maplayers", force: true do |t|
    t.string   "name"
    t.string   "baseurl"
    t.string   "basemap"
    t.integer  "maxzoom"
    t.integer  "minzoom"
    t.string   "imagetype"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "order"
  end

  create_table "mapseries", force: true do |t|
    t.string   "name"
    t.integer  "year_of_snapshot"
    t.string   "series"
    t.string   "edition"
    t.string   "details"
    t.integer  "scale"
    t.integer  "createdBy_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mapsets", force: true do |t|
    t.string   "name"
    t.string   "details"
    t.string   "publisher"
    t.string   "copyright"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "mapsheets", force: true do |t|
    t.string   "name"
    t.integer  "series_id"
    t.integer  "year_printed"
    t.integer  "year_revised"
    t.integer  "scale"
    t.string   "series"
    t.string   "sheet"
    t.string   "edition"
    t.text     "details"
    t.integer  "source_srid"
    t.decimal  "xleft"
    t.decimal  "xright"
    t.decimal  "ytop"
    t.decimal  "ybottom"
    t.integer  "createdBy_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.spatial  "extent",         limit: {:srid=>4326, :type=>"polygon"}
    t.integer  "uploadedmap_id"
    t.string   "dlink"
  end

  create_table "mapstatuses", force: true do |t|
    t.string "name"
  end

  create_table "messages", force: true do |t|
    t.string   "subject"
    t.text     "message"
    t.string   "fromName"
    t.string   "fromEmail"
    t.boolean  "approved"
    t.integer  "toUser_id"
    t.integer  "fromUser_id"
    t.integer  "forum_id"
    t.string   "auth_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "papersizes", force: true do |t|
    t.string   "name"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "projections", force: true do |t|
    t.string   "name"
    t.string   "proj4"
    t.string   "wkt"
    t.integer  "epsg"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "uploadedmaps", force: true do |t|
    t.string   "filename"
    t.string   "name"
    t.string   "series"
    t.string   "edition"
    t.integer  "scale"
    t.string   "sheet"
    t.string   "source"
    t.text     "attribution"
    t.integer  "year_printed"
    t.integer  "year_revised"
    t.text     "description"
    t.integer  "source_srid"
    t.string   "projection_name"
    t.decimal  "xresolution"
    t.decimal  "yresolution"
    t.decimal  "grid_xleft"
    t.decimal  "grid_xright"
    t.decimal  "grid_ytop"
    t.decimal  "grid_ybottom"
    t.decimal  "grid_width"
    t.decimal  "grid_height"
    t.integer  "pix_xleft"
    t.integer  "pix_xright"
    t.integer  "pix_ytop"
    t.integer  "pix_ybottom"
    t.integer  "pix_width"
    t.integer  "pix_height"
    t.integer  "createdby_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.spatial  "extent",             limit: {:srid=>4326, :type=>"polygon"}
    t.integer  "maxzoom"
    t.string   "url"
    t.integer  "mapstatus_id"
    t.integer  "pix_xtl"
    t.integer  "pix_ytl"
    t.integer  "pix_xtr"
    t.integer  "pix_ytr"
    t.integer  "pix_xbr"
    t.integer  "pix_ybr"
    t.integer  "pix_xbl"
    t.integer  "pix_ybl"
    t.integer  "pix_xtic1"
    t.integer  "pix_ytic1"
    t.integer  "pix_xtic2"
    t.integer  "pix_ytic2"
    t.decimal  "grid_xtic1"
    t.decimal  "grid_ytic1"
    t.decimal  "grid_xtic2"
    t.decimal  "grid_ytic2"
    t.decimal  "pix_rotation"
    t.decimal  "deg_rotation"
    t.boolean  "crop_done"
    t.boolean  "rotate_done"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "serverpath"
    t.string   "errortext"
    t.integer  "map_srid"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.string   "firstName"
    t.string   "lastName"
    t.integer  "role_id"
    t.string   "password_digest"
    t.string   "activation_digest"
    t.boolean  "activated",         default: false
    t.datetime "activated_at"
    t.string   "reset_digest"
    t.datetime "reset_sent_at"
  end

  add_index "users", ["remember_token"], :name => "index_users_on_remember_token"

end
