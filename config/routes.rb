require 'resque/server'
Mapspast::Application.routes.draw do

  mount Resque::Server.new, at: "/resque"
resources :sessions, only: [:new, :create, :destroy]
resources :users
resources :maptalk, only: [:index, :show, :update, :approve, :destroy]
resources :address_auths, only: [:edit]
resources :account_activations, only: [:edit]
resources :mapsheet
resources :help, only: [:show]
resources :query, only: [:show]


root 'maptalk#show'
  get "about" => "viewer#home"
  get "print" => "viewer#print"
  get "sessions" => 'maptalk#show'
  get "mapsheetinfo" => "mapsheet#new_info"
  match "mapsheet/:id/status" => "mapsheet#status",
      :via => :get
  get "maptalk/index"
  get "maptalk/show"
  get "mapnews/index" => "maptalk#index"
  get "mapnews" => "maptalk#show"
  get "viewer/home"
  get "viewer/map"
  get 'login' => "sessions#new"
  post 'login' => "sessions#create"
  get 'signup' => "users#new"
  post 'maptalk/approve' => "maptalk#approve"
  post 'maptalk/destroy' => "maptalk#destroy"
  post 'mapsheet/destroy' => "mapsheet#destroy"
  delete 'logout' => "sessions#destroy"
  match '/maptalk', to: 'maptalk#update',    via:'post'
  get "query" => "query#show" 
  match '/layerswitcher', to: "viewer#layerswitcher", via: 'get'
  match '/legend', to: "viewer#legend", via: 'get'


  
end
