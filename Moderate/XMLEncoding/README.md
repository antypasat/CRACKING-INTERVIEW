# 16.12 XML Encoding

## Opis Zadania / Problem Description

**XML Encoding**: Since XML is very verbose, you are given a way of encoding it where each tag gets mapped to a pre-defined integer value. The language/grammar is as follows:
```
Element --> Tag Attributes END Children END
Attribute --> Tag Value
END --> 0
Tag --> some predefined mapping to int
Value --> string value
```

For example, the following XML might be converted into the compressed string below (assuming a mapping of family→1, person→2, firstName→3, lastName→4, state→5):
```xml
<family lastName="McDowell" state="CA">
  <person firstName="Gayle">Some Message</person>
</family>
```

Becomes: `1 4 McDowell 5 CA 0 2 3 Gayle 0 Some Message 0 0`

Write code to print the encoded version of an XML element (passed in Element and Attribute objects).

**Kodowanie XML**: Ponieważ XML jest bardzo gadatliwy, otrzymujesz sposób kodowania go, gdzie każdy tag jest mapowany na predefiniowaną wartość całkowitą. Język/gramatyka jest następująca:
```
Element --> Tag Atrybuty END Dzieci END
Atrybut --> Tag Wartość
END --> 0
Tag --> predefiniowane mapowanie na int
Wartość --> wartość tekstowa
```

Hints: #466

## Wyjaśnienie Problemu / Problem Explanation

XML jest bardzo rozwlekły - każdy tag pojawia się dwa razy (otwierający i zamykający), plus nawiasy. Możemy znacznie skompresować XML mapując tagi na liczby całkowite.

XML is very verbose - each tag appears twice (opening and closing), plus brackets. We can significantly compress XML by mapping tags to integers.

**Gramatyka / Grammar**:
1. **Element** = Tag + Atrybuty + 0 + Dzieci + 0
2. **Atrybut** = Tag + Wartość
3. **Końcowy marker (END)** = 0

**Przykład krok po kroku / Step-by-step example**:
```xml
<family lastName="McDowell" state="CA">
  <person firstName="Gayle">Some Message</person>
</family>
```

Mapowanie / Mapping: family=1, person=2, firstName=3, lastName=4, state=5

Kodowanie / Encoding:
```
1                    // tag "family"
4 McDowell          // atrybut lastName="McDowell"
5 CA                // atrybut state="CA"
0                   // koniec atrybutów / end of attributes
  2                 // tag "person" (dziecko / child)
  3 Gayle          // atrybut firstName="Gayle"
  0                // koniec atrybutów / end of attributes
  Some Message     // tekst wewnętrzny / inner text
  0                // koniec dzieci person / end of person's children
0                   // koniec dzieci family / end of family's children
```

## Rozwiązania / Solutions

### Podejście 1: Rekurencyjne DFS - O(n) ✓ OPTYMALNE

**Idea**: Przeglądaj drzewo XML rekurencyjnie zgodnie z gramatyką:
1. Zakoduj tag elementu
2. Zakoduj wszystkie atrybuty
3. Dodaj 0 (koniec atrybutów)
4. Zakoduj wszystkie dzieci rekurencyjnie
5. Dodaj 0 (koniec dzieci)

**Idea**: Traverse XML tree recursively following the grammar:
1. Encode element tag
2. Encode all attributes
3. Add 0 (end of attributes)
4. Encode all children recursively
5. Add 0 (end of children)

```javascript
function encodeXML(element, tagMap) {
  const result = [];

  // 1. Tag elementu / Element tag
  result.push(tagMap[element.tag]);

  // 2. Atrybuty / Attributes
  for (const attr of element.attributes) {
    result.push(tagMap[attr.name]);
    result.push(attr.value);
  }

  // 3. Koniec atrybutów / End of attributes
  result.push(0);

  // 4. Tekst wewnętrzny / Inner text
  if (element.text) {
    result.push(element.text);
  }

  // 5. Dzieci / Children
  for (const child of element.children) {
    result.push(...encodeXML(child, tagMap));
  }

  // 6. Koniec dzieci / End of children
  result.push(0);

  return result;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n) gdzie n = liczba węzłów + atrybuty + tekst
- Pamięciowa / Space: O(h) gdzie h = wysokość drzewa (stack rekurencji)

### Podejście 2: Iteracyjne z Stackiem - O(n)

**Idea**: Użyj stacka do symulacji rekurencji.

**Idea**: Use stack to simulate recursion.

```javascript
function encodeXMLIterative(element, tagMap) {
  const result = [];
  const stack = [{ element, phase: 'start' }];

  while (stack.length > 0) {
    const { element, phase } = stack.pop();

    if (phase === 'start') {
      // Tag + atrybuty
      result.push(tagMap[element.tag]);

      for (const attr of element.attributes) {
        result.push(tagMap[attr.name]);
        result.push(attr.value);
      }

      result.push(0); // Koniec atrybutów

      if (element.text) {
        result.push(element.text);
      }

      // Dodaj marker końca
      stack.push({ element, phase: 'end' });

      // Dodaj dzieci w odwrotnej kolejności
      for (let i = element.children.length - 1; i >= 0; i--) {
        stack.push({ element: element.children[i], phase: 'start' });
      }
    } else if (phase === 'end') {
      result.push(0); // Koniec dzieci
    }
  }

  return result;
}
```

**Złożoność / Complexity**:
- Czasowa / Time: O(n)
- Pamięciowa / Space: O(h)

### Podejście 3: Builder Pattern - O(n)

**Idea**: Użyj klasy Builder do czytelniejszego kodowania.

**Idea**: Use Builder class for more readable encoding.

```javascript
class XMLEncoder {
  constructor(tagMap) {
    this.tagMap = tagMap;
    this.result = [];
  }

  encode(element) {
    this.encodeElement(element);
    return this.result;
  }

  encodeElement(element) {
    // 1. Tag
    this.addTag(element.tag);

    // 2. Atrybuty
    this.encodeAttributes(element.attributes);

    // 3. Koniec atrybutów
    this.addEnd();

    // 4. Tekst
    if (element.text) {
      this.addValue(element.text);
    }

    // 5. Dzieci
    this.encodeChildren(element.children);

    // 6. Koniec dzieci
    this.addEnd();
  }

  encodeAttributes(attributes) {
    for (const attr of attributes) {
      this.addTag(attr.name);
      this.addValue(attr.value);
    }
  }

  encodeChildren(children) {
    for (const child of children) {
      this.encodeElement(child);
    }
  }

  addTag(tag) {
    this.result.push(this.tagMap[tag]);
  }

  addValue(value) {
    this.result.push(value);
  }

  addEnd() {
    this.result.push(0);
  }
}
```

## Dekodowanie / Decoding

Aby zdekodować z powrotem do XML:

To decode back to XML:

```javascript
function decodeXML(encoded, reverseTagMap) {
  let i = 0;

  function decodeElement() {
    const element = {
      tag: reverseTagMap[encoded[i++]],
      attributes: [],
      children: [],
      text: null
    };

    // Dekoduj atrybuty / Decode attributes
    while (encoded[i] !== 0) {
      const attrName = reverseTagMap[encoded[i++]];
      const attrValue = encoded[i++];
      element.attributes.push({ name: attrName, value: attrValue });
    }
    i++; // Pomiń 0 / Skip 0

    // Dekoduj dzieci i tekst / Decode children and text
    while (encoded[i] !== 0) {
      if (typeof encoded[i] === 'number') {
        element.children.push(decodeElement());
      } else {
        element.text = encoded[i++];
      }
    }
    i++; // Pomiń 0 / Skip 0

    return element;
  }

  return decodeElement();
}
```

## Szczególne Przypadki / Edge Cases

1. **Element bez atrybutów**: `<tag>text</tag>` → `[tagId, 0, "text", 0]`
2. **Element bez dzieci**: `<tag attr="val"/>` → `[tagId, attrId, "val", 0, 0]`
3. **Element bez tekstu**: `<tag><child/></tag>` → `[tagId, 0, childId, 0, 0, 0]`
4. **Pusty element**: `<tag/>` → `[tagId, 0, 0]`
5. **Wiele atrybutów**: Tag z wieloma atrybutami
6. **Wiele dzieci**: Element z wieloma dziećmi
7. **Głęboka hierarchia**: Drzewo o dużej głębokości
8. **Tekst z spacjami**: Zachowaj białe znaki

## Optymalizacje / Optimizations

### 1. Kompresja Wartości
Jeśli wartości atrybutów się powtarzają, możemy je też mapować:

If attribute values repeat, we can map them too:

```javascript
function encodeWithValueMapping(element, tagMap, valueMap) {
  // Mapuj często występujące wartości
  // Map frequently occurring values
}
```

### 2. Kodowanie Długości
Dodaj długość przed każdym elementem dla szybszego parsowania:

Add length before each element for faster parsing:

```javascript
// [length, tag, attrs..., 0, children..., 0]
```

### 3. Kompresja Binarna
Użyj bajtów zamiast liczb całkowitych:

Use bytes instead of integers:

```javascript
// 1 bajt na tag (max 256 tagów)
// 1 byte per tag (max 256 tags)
```

## Porównanie z Innymi Formatami / Comparison with Other Formats

| Format | Rozmiar (przykład) | Czytelność | Parsowanie |
|--------|-------------------|-----------|------------|
| XML | ~200 bytes | Wysoka | Średnie |
| JSON | ~150 bytes | Wysoka | Szybkie |
| Zakodowany XML | ~50 bytes | Niska | Bardzo szybkie |
| Protobuf | ~30 bytes | Bardzo niska | Najszybsze |

## Zastosowania / Applications

1. **Kompresja danych**: Zmniejszenie rozmiaru XML
2. **Przesyłanie przez sieć**: Mniejsze pakiety
3. **Przechowywanie**: Oszczędność miejsca
4. **API**: Szybsza serializacja/deserializacja
5. **Mobile**: Oszczędność baterii i danych

## Analiza Matematyczna / Mathematical Analysis

Dla XML z:
- n elementów
- m atrybutów (średnio a atrybutów na element)
- średnia długość nazwy tagu: t bajtów
- średnia długość wartości: v bajtów

**Rozmiar oryginalny / Original size**:
```
Size_XML ≈ n × (2t + 5) + m × (t + v + 4)
         ≈ 2nt + 5n + mt + mv + 4m
```

**Rozmiar zakodowany / Encoded size**:
```
Size_Encoded ≈ n × 4 + m × (4 + v)
             ≈ 4n + 4m + mv
```

**Kompresja / Compression ratio**:
```
Ratio = (2nt + 5n + mt + 4m) / (4n + 4m)
      ≈ (2t + mt/n + 9) / 4  (dla typowego XML)
      ≈ 5-10x kompresja
```

## Wnioski / Conclusions

XML Encoding to doskonały przykład:
1. **Kompresji z mapowaniem**: Zamień powtarzające się stringi na liczby
2. **Definicji gramatyki**: Jasna struktura ułatwia parsowanie
3. **Trade-off czytelność vs rozmiar**: Tracisz czytelność, zyskujesz rozmiar
4. **Rekurencji**: Drzewo XML idealnie pasuje do rekurencji

XML Encoding is an excellent example of:
1. **Compression with mapping**: Replace repeating strings with numbers
2. **Grammar definition**: Clear structure makes parsing easier
3. **Readability vs size trade-off**: Lose readability, gain size
4. **Recursion**: XML tree perfectly fits recursion
