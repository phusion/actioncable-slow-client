class SlowClientBenchmarkChannel < ApplicationCable::Channel  
  def subscribed
    @@time_stamp_thread ||= TimeStampThread.run
    stream_from 'timestamps'
  end
end 

class TimeStampThread
  def self.run
    Thread.new { new.loop }
  end

  def loop
    step = 1
    last_tick = Time.now.to_f - step
    while true
      now = Time.now.to_f
      if last_tick + step < now
        broadcast
        last_tick = now
      end
      sleep 0.05
    end
  end

  def broadcast
    ActionCable.server.broadcast 'timestamps',
      time: Time.now.to_f
  end
end
