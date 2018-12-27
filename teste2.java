def fun (L, n):
 if (n == 1): return L[0]
 if (n == 2):
 if (L[0] > L[1]):
 return L[1]
 else:
 return L[0];
 r = fun (L, n - 1);
 if (r > L[n - 1]):
 return L[n - 1];
 else:
 return r