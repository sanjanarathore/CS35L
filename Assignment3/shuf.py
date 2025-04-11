#!/usr/bin/env python3
import argparse, random, sys

def main():
  parser = argparse.ArgumentParser()
  
  # add arguments to argument parser
  parser.add_argument('-e', '--echo', nargs='*', help='output shuffled text')
  parser.add_argument('-i', '--input-range', nargs='?', help='shuffle range of unsigned decimal integers')
  parser.add_argument('-n', '--head-count', type=int, nargs="?", help='ouput at most count lines. by default, all input lines are output')
  parser.add_argument('-r', '--repeat', action = 'store_true', help='repeat output lines')
  parser.add_argument("input_file", nargs="?", default="-", help="input file name or '-' for standard input")
  
  args = parser.parse_args()
  buffer = []

  # Input options
  if args.input_range:
    # handle the -i option for input
    start, end = map(int, (args.input_range).split('-'))
    buffer = list(range(start,end+1))
  elif  args.echo:
    # handle the -e option for input
    buffer = args.echo
  else:
    # handle file and stdin methods of getting input
    if args.input_file == "-":
        buffer = sys.stdin.readlines()
     
    else:
        with open(args.input_file, "r") as f:
            buffer = f.readlines()

    for i in range(len(buffer)):
            buffer[i] = buffer[i].strip() 
              
  # shuffle input
  random.shuffle(buffer)
  
    
  # Output options
  if args.repeat:
      temp_buffer = list(buffer)
      buffer = []
      if args.head_count:
          # handle repeat option with -n          
          for num in range(args.head_count):
              random.shuffle(temp_buffer)
              buffer.append(temp_buffer[0])
      else:
          # handle normal repeat option
          while True:
              random.shuffle(temp_buffer)
              buffer.append(temp_buffer[0])
  if args.head_count:
      # handle the -n option for output
      buffer = buffer[:args.head_count]

  # print output
  for item in buffer:
      sys.stdout.write(str(item) + "\n")

    
if __name__ == "__main__":
  main()
