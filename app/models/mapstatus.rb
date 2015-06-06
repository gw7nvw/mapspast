class Mapstatus < ActiveRecord::Base

def compare(othername)
  os=Mapstatus.find_by(:name => othername)
  if os
    if os.id < self.id then result=">" end
    if os.id > self.id then result="<" end
    if os.id == self.id then result="=" end
 end
  result 
end
end
