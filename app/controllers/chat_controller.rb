class ChatController < ApplicationController
  unloadable
  def index
     @chats = Chat.find_by_sql(["SELECT chats.*, u.firstName FROM chats INNER JOIN users u on chats.user = u.id  ORDER BY sendDate DESC" ])
  end
  def send_chat
    Chat.create(:message => params[:msg], :user => User.current.id)
    #@chat.chatMessage(params[:msg],"test")
    #@chat.save
  end
  def receive_chat
    @user = User.current
    @chats = Chat.find_by_sql(["SELECT chats.*, u.firstName FROM chats INNER JOIN users u on chats.user = u.id  ORDER BY sendDate DESC LIMIT 15" ])
    render :partial => 'chat/receive_chat.erb'
  end
end
