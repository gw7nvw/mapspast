class Sleeper
  @queue = :sleep
 
  def self.perform(seconds)
     cmd='echo hello > qwerty.log'
    puts "Running "+cmd
    success = system( cmd )

  end
end

