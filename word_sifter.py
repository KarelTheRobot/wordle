f = open('words_alpha.txt', 'r')

lines = f.readlines()
lines = [x.strip() for x in lines]

maxlen = max([len(x) for x in lines])

final = []

total = 0

for l in range(maxlen):
    print(f"Start of length {l}: {total}")
    sub_list = [x for x in lines if len(x) == l]
    final += sub_list
    total += len(sub_list)

print([x for x in lines if len(x) == 2])

f.close()
g = open('words_sorted.txt', 'w')
g.write('\n'.join(final))