require 'resque/server'
Mapspast::Application.routes.draw do

  mount Resque::Server.new, at: "/resque"
resources :sessions, only: [:new, :create, :destroy]
resources :users
resources :forum, only: [:index, :show, :update, :approve, :destroy]
resources :address_auths, only: [:edit]
resources :mapsheet


root 'viewer#home'
  get "forum/index"
  get "forum/show"
  get "viewer/home"
  get "viewer/map"
  get 'login' => "sessions#new"
  post 'login' => "sessions#create"
  post 'forum/approve' => "forum#approve"
  post 'forum/destroy' => "forum#destroy"
  delete 'logout' => "sessions#destroy"
  match '/forum', to: 'forum#update',    via:'post'
  get "query" => "query#show" 

  
end
