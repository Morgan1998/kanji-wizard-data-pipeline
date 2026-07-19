# Switch from barrel pattern to subpath imports

### Problem
Realized that barrel export pattern isn't actually that great. In fact, it's seen as an anti pattern. It creates lots of memory bloat via having to load everything in the barrel, and it can trigger circular dependencies. 

### Solution
I'll use wildcard subpath imports from now on to keep my imports short, clean, and organized. Now node will only load the modules that I ask for in my import. 
