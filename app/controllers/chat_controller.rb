class ChatController < ApplicationController
  unloadable
  def index
     @chats = Chat.find_by_sql(["SELECT chats.*, u.firstName, u.lastName FROM chats INNER JOIN users u on chats.user = u.id  ORDER BY created_at DESC" ])
  end
  def send_chat
    Chat.create(:message => params[:msg], :user => User.current.id)
  end
  def receive_chat
    @user = User.current
    @chats = Chat.find_by_sql(["SELECT chats.*, u.firstName, u.lastName FROM chats INNER JOIN users u on chats.user = u.id  ORDER BY created_at DESC LIMIT 15" ])
    render :partial => 'chat/receive_chat.erb'
  end
end
