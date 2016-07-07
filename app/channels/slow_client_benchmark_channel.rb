class SlowClientBenchmarkChannel < ApplicationCable::Channel
  LOTS_OF_DATA = "a" * 15_060
  INITIALIZATION_MUTEX = Mutex.new

  def subscribed
    @@clients ||= Concurrent::Hash.new

    INITIALIZATION_MUTEX.synchronize do
      @@time_stamp_thread ||= Looper.run(1) do
        ActionCable.server.broadcast 'timestamps',
          time: Time.now.to_f
      end

      @@random_data_thread ||= Looper.run(0.033) do
        ActionCable.server.broadcast 'peers',
          peers: @@clients.map {|c| { data: rand, more_data: LOTS_OF_DATA } }
      end
    end

    @@clients[self] = {}

    stream_from 'timestamps'
    stream_from 'peers'
  end

  def unsubscribed
    @@clients.delete(self)
  end
end

class Looper
  def self.run(step, &block)
    Thread.new { new(step, &block).loop }
  end

  def initialize(step, &block)
    @step = step
    @block = block
  end

  def loop
    last_tick = Time.now.to_f - @step
    while true
      now = Time.now.to_f
      if last_tick + @step < now
        @block.call
        last_tick = now
      end
      sleep 0.01
    end
  end
end
