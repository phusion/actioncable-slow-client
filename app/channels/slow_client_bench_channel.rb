class SlowClientBenchChannel < ApplicationCable::Channel  
  def subscribed
    @time_stamp_thread ||= TimeStampThread.run
    stream_from 'timestamps'
  end
end 

class TimeStampThread
  def self.run
    Thread.new do
      step = 1 # 1s = 1fps
      last_tick = Time.now.to_f - step
      while true do
        now = Time.now.to_f
        if last_tick < now - step
          ActionCable.server.broadcast 'timestamps',
            time: Time.now.to_f
        end

        sleep 0.05
      end
    end
  end
end
