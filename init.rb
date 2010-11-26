require 'redmine'
require_dependency 'redmine_jchat/hooks'
Redmine::Plugin.register :redmine_jchat do
  name 'Redmine JChat'
  author 'Joshua Enfield'
  description 'Provides a team chat similiar to Google\'s/Facebooks chat.'
  version '0.2.0'
  settings(:partial => 'settings/chat')
end
