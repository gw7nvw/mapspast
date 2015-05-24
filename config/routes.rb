Mapspast::Application.routes.draw do
resources :sessions, only: [:new, :create, :destroy]
resources :users

root 'viewer#home'
  get "viewer/home"
  get "viewer/map"
  get 'login' => "sessions#new"
  post 'login' => "sessions#create"
  delete 'logout' => "sessions#destroy"


  
end
