import csv
import numpy

with open('./client/ai.txt') as inf:
    reader = csv.reader(inf, delimiter=" ")
    second_col = list(zip(*reader))[0]
    second_col = list(map(int, second_col))
    unsorted = second_col[:]  # copy without reference
    second_col.sort(reverse=True)

dcg = 0
idcg = 0
p = 10
print(unsorted)
print(second_col)
for i in range(0, p):
    u = unsorted[i]
    s = second_col[i]
    dcg += (u)/numpy.log2(i+2)
    idcg += (s)/numpy.log2(i+2)
print(dcg)
print(idcg)
ndcg = dcg/idcg
print(ndcg)
