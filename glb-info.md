
 OVERVIEW
 ────────────────────────────────────────────
| key                | value                 |
| ---                | ---                   |
| version            | 2.0                   |
| generator          | glTF-Transform v4.2.1 |
| extensionsUsed     | KHR_mesh_quantization |
| extensionsRequired | KHR_mesh_quantization |



 SCENES
 ────────────────────────────────────────────
| #   | name     | rootName | bboxMin                        | bboxMax                     | renderVertexCount¹ | uploadVertexCount | uploadNaiveVertexCount |
| --- | ---      | ---      | ---                            | ---                         | ---                | ---               | ---                    |
| 0   | AuxScene |          | -0.69436, -2.85775, -169.84378 | 652.52939, 2.44083, 0.66296 | 35,645,859         | 1,617,939         | 1,815,725              |

¹ Expected number of vertices processed by the vertex shader for one render
  pass, without considering the vertex cache.

² Expected number of vertices uploaded to GPU, assuming each Accessor
  is uploaded only once. Actual number uploaded may be higher, 
  dependent on the implementation and vertex buffer layout.

³ Expected number of vertices uploaded to GPU, assuming each Primitive
  is uploaded once, duplicating vertex attributes shared among Primitives.



 MESHES
 ────────────────────────────────────────────
| #   | name | mode      | meshPrimitives | glPrimitives | vertices | indices | attributes                                             | instances | size¹     |
| --- | ---  | ---       | ---            | ---          | ---      | ---     | ---                                                    | ---       | ---       |
| 0   |      | TRIANGLES | 1              | 163          | 179      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.59 KB   |
| 1   |      | TRIANGLES | 1              | 16           | 26       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 330 Bytes |
| 2   |      | TRIANGLES | 1              | 86           | 120      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.6 KB    |
| 3   |      | TRIANGLES | 1              | 39           | 53       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 711 Bytes |
| 4   |      | TRIANGLES | 1              | 39           | 53       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 711 Bytes |
| 5   |      | TRIANGLES | 1              | 7            | 11       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 141 Bytes |
| 6   |      | TRIANGLES | 1              | 59           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 939 Bytes |
| 7   |      | TRIANGLES | 1              | 102          | 108      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.58 KB   |
| 8   |      | TRIANGLES | 1              | 21           | 23       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 333 Bytes |
| 9   |      | TRIANGLES | 1              | 36           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 612 Bytes |
| 10  |      | TRIANGLES | 1              | 119          | 123      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.82 KB   |
| 11  |      | TRIANGLES | 1              | 19           | 21       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 303 Bytes |
| 12  |      | TRIANGLES | 1              | 50           | 54       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 786 Bytes |
| 13  |      | TRIANGLES | 1              | 7            | 13       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 159 Bytes |
| 14  |      | TRIANGLES | 1              | 113          | 123      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.78 KB   |
| 15  |      | TRIANGLES | 1              | 72           | 86       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.21 KB   |
| 16  |      | TRIANGLES | 1              | 118          | 128      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.86 KB   |
| 17  |      | TRIANGLES | 1              | 130          | 132      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.97 KB   |
| 18  |      | TRIANGLES | 1              | 21           | 25       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 351 Bytes |
| 19  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 63        | 80 Bytes  |
| 20  |      | TRIANGLES | 1              | 60           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.22 KB   |
| 21  |      | TRIANGLES | 1              | 590          | 892      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 43        | 18.7 KB   |
| 22  |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 42        | 288 Bytes |
| 23  |      | TRIANGLES | 1              | 112          | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 84        | 1.79 KB   |
| 24  |      | TRIANGLES | 1              | 168          | 275      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 42        | 3.48 KB   |
| 25  |      | TRIANGLES | 1              | 192          | 192      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 42        | 2.88 KB   |
| 26  |      | TRIANGLES | 1              | 1,209        | 1,237    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 18.39 KB  |
| 27  |      | TRIANGLES | 1              | 24           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 396 Bytes |
| 28  |      | TRIANGLES | 1              | 24           | 26       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 378 Bytes |
| 29  |      | TRIANGLES | 1              | 45           | 57       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 783 Bytes |
| 30  |      | TRIANGLES | 1              | 22           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 348 Bytes |
| 31  |      | TRIANGLES | 1              | 12           | 22       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 270 Bytes |
| 32  |      | TRIANGLES | 1              | 480          | 458      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 7 KB      |
| 33  |      | TRIANGLES | 1              | 11           | 13       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 183 Bytes |
| 34  |      | TRIANGLES | 1              | 41           | 43       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 633 Bytes |
| 35  |      | TRIANGLES | 1              | 64           | 66       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 978 Bytes |
| 36  |      | TRIANGLES | 1              | 56           | 56       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 840 Bytes |
| 37  |      | TRIANGLES | 1              | 70           | 70       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.05 KB   |
| 38  |      | TRIANGLES | 1              | 82           | 80       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.21 KB   |
| 39  |      | TRIANGLES | 1              | 17           | 19       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 273 Bytes |
| 40  |      | TRIANGLES | 1              | 70           | 70       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.05 KB   |
| 41  |      | TRIANGLES | 1              | 14           | 14       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 210 Bytes |
| 42  |      | TRIANGLES | 1              | 47           | 49       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 723 Bytes |
| 43  |      | TRIANGLES | 1              | 16           | 18       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 258 Bytes |
| 44  |      | TRIANGLES | 1              | 59           | 59       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 885 Bytes |
| 45  |      | TRIANGLES | 1              | 101          | 105      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.55 KB   |
| 46  |      | TRIANGLES | 1              | 164          | 168      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.5 KB    |
| 47  |      | TRIANGLES | 1              | 17           | 19       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 273 Bytes |
| 48  |      | TRIANGLES | 1              | 32           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 480 Bytes |
| 49  |      | TRIANGLES | 1              | 717          | 741      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 10.97 KB  |
| 50  |      | TRIANGLES | 1              | 23           | 25       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 363 Bytes |
| 51  |      | TRIANGLES | 1              | 134          | 172      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.35 KB   |
| 52  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 53  |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 240 Bytes |
| 54  |      | TRIANGLES | 1              | 6            | 10       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 126 Bytes |
| 55  |      | TRIANGLES | 1              | 14           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 300 Bytes |
| 56  |      | TRIANGLES | 1              | 172          | 184      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.69 KB   |
| 57  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 58  |      | TRIANGLES | 1              | 8            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 120 Bytes |
| 59  |      | TRIANGLES | 1              | 24           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 46        | 688 Bytes |
| 60  |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 46        | 192 Bytes |
| 61  |      | TRIANGLES | 1              | 244          | 344      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6,578     | 4.56 KB   |
| 62  |      | TRIANGLES | 1              | 244          | 344      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 46        | 7.31 KB   |
| 63  |      | TRIANGLES | 1              | 11,712       | 7,718    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 3         | 139.73 KB |
| 64  |      | TRIANGLES | 1              | 18,784       | 16,023   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 3         | 256.91 KB |
| 65  |      | TRIANGLES | 1              | 18,720       | 9,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 3         | 199.17 KB |
| 66  |      | TRIANGLES | 1              | 6,480        | 3,643    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 3         | 71.67 KB  |
| 67  |      | TRIANGLES | 1              | 1,800        | 2,172    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 330       | 30.35 KB  |
| 68  |      | TRIANGLES | 1              | 1,800        | 2,172    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 330       | 30.35 KB  |
| 69  |      | TRIANGLES | 1              | 768          | 1,190    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 156       | 15.32 KB  |
| 70  |      | TRIANGLES | 1              | 592          | 900      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 156       | 11.65 KB  |
| 71  |      | TRIANGLES | 1              | 1,020        | 1,560    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 156       | 20.16 KB  |
| 72  |      | TRIANGLES | 1              | 431          | 279      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 624       | 5.1 KB    |
| 73  |      | TRIANGLES | 1              | 734          | 776      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 312       | 11.39 KB  |
| 74  |      | TRIANGLES | 1              | 212          | 232      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 312       | 3.36 KB   |
| 75  |      | TRIANGLES | 1              | 792          | 872      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 312       | 12.6 KB   |
| 76  |      | TRIANGLES | 1              | 938          | 704      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 312       | 11.96 KB  |
| 77  |      | TRIANGLES | 1              | 366          | 415      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 312       | 5.93 KB   |
| 78  |      | TRIANGLES | 1              | 574          | 376      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 150       | 6.83 KB   |
| 79  |      | TRIANGLES | 1              | 456          | 488      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 156       | 7.13 KB   |
| 80  |      | TRIANGLES | 1              | 456          | 488      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 156       | 7.13 KB   |
| 81  |      | TRIANGLES | 1              | 294          | 332      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 156       | 6.08 KB   |
| 82  |      | TRIANGLES | 1              | 198          | 252      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 150       | 3.46 KB   |
| 83  |      | TRIANGLES | 1              | 254          | 402      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 150       | 5.14 KB   |
| 84  |      | TRIANGLES | 1              | 306          | 342      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 150       | 4.91 KB   |
| 85  |      | TRIANGLES | 1              | 182          | 254      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 468       | 5.41 KB   |
| 86  |      | TRIANGLES | 1              | 133          | 139      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 2.05 KB   |
| 87  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 18        | 64 Bytes  |
| 88  |      | TRIANGLES | 1              | 44           | 74       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 930 Bytes |
| 89  |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 360 Bytes |
| 90  |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.15 KB   |
| 91  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 18        | 64 Bytes  |
| 92  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 93  |      | TRIANGLES | 1              | 6            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 144 Bytes |
| 94  |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.12 KB   |
| 95  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 96  |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 408 Bytes |
| 97  |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 64 Bytes  |
| 98  |      | TRIANGLES | 1              | 76           | 80       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.18 KB   |
| 99  |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 100 |      | TRIANGLES | 1              | 23           | 35       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 453 Bytes |
| 101 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 102 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 103 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 104 |      | TRIANGLES | 1              | 56           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.16 KB   |
| 105 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 106 |      | TRIANGLES | 1              | 34           | 36       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 528 Bytes |
| 107 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 108 |      | TRIANGLES | 1              | 140          | 208      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 2.71 KB   |
| 109 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 110 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 111 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 18        | 64 Bytes  |
| 112 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 113 |      | TRIANGLES | 1              | 50           | 84       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.06 KB   |
| 114 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.15 KB   |
| 115 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 116 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 240 Bytes |
| 117 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 118 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 119 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 120 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 121 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 122 |      | TRIANGLES | 1              | 6            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 144 Bytes |
| 123 |      | TRIANGLES | 1              | 60           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.22 KB   |
| 124 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 125 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 126 |      | TRIANGLES | 1              | 20           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 372 Bytes |
| 127 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 408 Bytes |
| 128 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 129 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 192 Bytes |
| 130 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 16        | 1.12 KB   |
| 131 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 132 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 18        | 160 Bytes |
| 133 |      | TRIANGLES | 1              | 46           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.1 KB    |
| 134 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 135 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 360 Bytes |
| 136 |      | TRIANGLES | 1              | 24           | 35       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 459 Bytes |
| 137 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 156 Bytes |
| 138 |      | TRIANGLES | 1              | 150          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 2.81 KB   |
| 139 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 288 Bytes |
| 140 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 18        | 64 Bytes  |
| 141 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 624 Bytes |
| 142 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 624 Bytes |
| 143 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 288 Bytes |
| 144 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 807 Bytes |
| 145 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 288 Bytes |
| 146 |      | TRIANGLES | 1              | 62           | 136      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 18        | 2.68 KB   |
| 147 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 156 Bytes |
| 148 |      | TRIANGLES | 1              | 220          | 240      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 3.48 KB   |
| 149 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 807 Bytes |
| 150 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 151 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 156 Bytes |
| 152 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 624 Bytes |
| 153 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 288 Bytes |
| 154 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 156 Bytes |
| 155 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 240 Bytes |
| 156 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 288 Bytes |
| 157 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 807 Bytes |
| 158 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 624 Bytes |
| 159 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 288 Bytes |
| 160 |      | TRIANGLES | 1              | 64           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.25 KB   |
| 161 |      | TRIANGLES | 1              | 1,800        | 2,172    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 252       | 30.35 KB  |
| 162 |      | TRIANGLES | 1              | 1,800        | 2,172    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 252       | 30.35 KB  |
| 163 |      | TRIANGLES | 1              | 768          | 1,190    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 135       | 15.32 KB  |
| 164 |      | TRIANGLES | 1              | 592          | 900      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 135       | 11.65 KB  |
| 165 |      | TRIANGLES | 1              | 1,020        | 1,560    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 135       | 20.16 KB  |
| 166 |      | TRIANGLES | 1              | 431          | 279      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 540       | 5.1 KB    |
| 167 |      | TRIANGLES | 1              | 734          | 776      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 270       | 11.39 KB  |
| 168 |      | TRIANGLES | 1              | 212          | 232      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 270       | 3.36 KB   |
| 169 |      | TRIANGLES | 1              | 792          | 872      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 270       | 12.6 KB   |
| 170 |      | TRIANGLES | 1              | 938          | 704      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 270       | 11.96 KB  |
| 171 |      | TRIANGLES | 1              | 366          | 415      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 270       | 5.93 KB   |
| 172 |      | TRIANGLES | 1              | 574          | 376      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 126       | 6.83 KB   |
| 173 |      | TRIANGLES | 1              | 456          | 488      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 126       | 7.13 KB   |
| 174 |      | TRIANGLES | 1              | 456          | 488      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 126       | 7.13 KB   |
| 175 |      | TRIANGLES | 1              | 294          | 332      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 126       | 6.08 KB   |
| 176 |      | TRIANGLES | 1              | 198          | 252      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 126       | 3.46 KB   |
| 177 |      | TRIANGLES | 1              | 254          | 402      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 126       | 5.14 KB   |
| 178 |      | TRIANGLES | 1              | 306          | 342      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 126       | 4.91 KB   |
| 179 |      | TRIANGLES | 1              | 182          | 254      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 378       | 5.41 KB   |
| 180 |      | TRIANGLES | 1              | 133          | 139      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.05 KB   |
| 181 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 182 |      | TRIANGLES | 1              | 44           | 74       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 930 Bytes |
| 183 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 360 Bytes |
| 184 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.15 KB   |
| 185 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 186 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 187 |      | TRIANGLES | 1              | 6            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 144 Bytes |
| 188 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.12 KB   |
| 189 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 190 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 408 Bytes |
| 191 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 192 |      | TRIANGLES | 1              | 76           | 80       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.18 KB   |
| 193 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 194 |      | TRIANGLES | 1              | 23           | 35       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 453 Bytes |
| 195 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 196 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 197 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 198 |      | TRIANGLES | 1              | 56           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.16 KB   |
| 199 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 200 |      | TRIANGLES | 1              | 34           | 36       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 528 Bytes |
| 201 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 202 |      | TRIANGLES | 1              | 140          | 208      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.71 KB   |
| 203 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 204 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 205 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 206 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 207 |      | TRIANGLES | 1              | 50           | 84       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.06 KB   |
| 208 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.15 KB   |
| 209 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 210 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 240 Bytes |
| 211 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 212 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 213 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 214 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 215 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 216 |      | TRIANGLES | 1              | 6            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 144 Bytes |
| 217 |      | TRIANGLES | 1              | 60           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.22 KB   |
| 218 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 219 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 220 |      | TRIANGLES | 1              | 20           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 372 Bytes |
| 221 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 408 Bytes |
| 222 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 223 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 224 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 1.12 KB   |
| 225 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 226 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 160 Bytes |
| 227 |      | TRIANGLES | 1              | 46           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.1 KB    |
| 228 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 229 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 360 Bytes |
| 230 |      | TRIANGLES | 1              | 24           | 35       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 459 Bytes |
| 231 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 156 Bytes |
| 232 |      | TRIANGLES | 1              | 150          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.81 KB   |
| 233 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 288 Bytes |
| 234 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 235 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 624 Bytes |
| 236 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 624 Bytes |
| 237 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 288 Bytes |
| 238 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 807 Bytes |
| 239 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 288 Bytes |
| 240 |      | TRIANGLES | 1              | 62           | 136      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 2.68 KB   |
| 241 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 156 Bytes |
| 242 |      | TRIANGLES | 1              | 220          | 240      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 3.48 KB   |
| 243 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 807 Bytes |
| 244 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 245 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 156 Bytes |
| 246 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 624 Bytes |
| 247 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 288 Bytes |
| 248 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 156 Bytes |
| 249 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 240 Bytes |
| 250 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 288 Bytes |
| 251 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 807 Bytes |
| 252 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 624 Bytes |
| 253 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 288 Bytes |
| 254 |      | TRIANGLES | 1              | 64           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.25 KB   |
| 255 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 17        | 64 Bytes  |
| 256 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 17        | 192 Bytes |
| 257 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 17        | 192 Bytes |
| 258 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 17        | 192 Bytes |
| 259 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 17        | 192 Bytes |
| 260 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 17        | 192 Bytes |
| 261 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 17        | 48 Bytes  |
| 262 |      | TRIANGLES | 1              | 4,123        | 4,309    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 63.52 KB  |
| 263 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 1.98 KB   |
| 264 |      | TRIANGLES | 1              | 1,364        | 2,294    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 28.83 KB  |
| 265 |      | TRIANGLES | 1              | 558          | 868      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.16 KB  |
| 266 |      | TRIANGLES | 1              | 1,674        | 2,732    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 34.63 KB  |
| 267 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 1.98 KB   |
| 268 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 269 |      | TRIANGLES | 1              | 186          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.46 KB   |
| 270 |      | TRIANGLES | 1              | 1,674        | 2,728    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 34.6 KB   |
| 271 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 272 |      | TRIANGLES | 1              | 620          | 992      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.65 KB  |
| 273 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 1.98 KB   |
| 274 |      | TRIANGLES | 1              | 2,356        | 2,480    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 36.46 KB  |
| 275 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 276 |      | TRIANGLES | 1              | 713          | 1,085    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.04 KB  |
| 277 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 278 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 279 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 280 |      | TRIANGLES | 1              | 1,736        | 2,852    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 36.08 KB  |
| 281 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 282 |      | TRIANGLES | 1              | 1,054        | 1,116    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 16.37 KB  |
| 283 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 284 |      | TRIANGLES | 1              | 4,340        | 6,448    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 84.07 KB  |
| 285 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 286 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 287 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 1.98 KB   |
| 288 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 289 |      | TRIANGLES | 1              | 1,550        | 2,604    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 32.74 KB  |
| 290 |      | TRIANGLES | 1              | 1,674        | 2,732    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 34.63 KB  |
| 291 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 292 |      | TRIANGLES | 1              | 310          | 620      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 7.44 KB   |
| 293 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 294 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 295 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 296 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 297 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 298 |      | TRIANGLES | 1              | 186          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.46 KB   |
| 299 |      | TRIANGLES | 1              | 1,860        | 2,976    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 37.94 KB  |
| 300 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 301 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 302 |      | TRIANGLES | 1              | 620          | 868      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.53 KB  |
| 303 |      | TRIANGLES | 1              | 620          | 992      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.65 KB  |
| 304 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 305 |      | TRIANGLES | 1              | 248          | 496      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.95 KB   |
| 306 |      | TRIANGLES | 1              | 1,674        | 2,728    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 34.6 KB   |
| 307 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 308 |      | TRIANGLES | 1              | 124          | 248      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 4.96 KB   |
| 309 |      | TRIANGLES | 1              | 1,426        | 2,852    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 34.22 KB  |
| 310 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 311 |      | TRIANGLES | 1              | 558          | 868      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.16 KB  |
| 312 |      | TRIANGLES | 1              | 744          | 1,085    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.23 KB  |
| 313 |      | TRIANGLES | 1              | 248          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.84 KB   |
| 314 |      | TRIANGLES | 1              | 4,650        | 6,572    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 87.05 KB  |
| 315 |      | TRIANGLES | 1              | 372          | 744      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.93 KB   |
| 316 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 1.98 KB   |
| 317 |      | TRIANGLES | 1              | 992          | 1,488    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.34 KB  |
| 318 |      | TRIANGLES | 1              | 992          | 1,488    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.34 KB  |
| 319 |      | TRIANGLES | 1              | 372          | 744      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.93 KB   |
| 320 |      | TRIANGLES | 1              | 1,147        | 2,015    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 25.02 KB  |
| 321 |      | TRIANGLES | 1              | 372          | 744      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.93 KB   |
| 322 |      | TRIANGLES | 1              | 1,922        | 4,216    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 83.2 KB   |
| 323 |      | TRIANGLES | 1              | 248          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.84 KB   |
| 324 |      | TRIANGLES | 1              | 6,820        | 7,440    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 107.88 KB |
| 325 |      | TRIANGLES | 1              | 1,147        | 2,015    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 25.02 KB  |
| 326 |      | TRIANGLES | 1              | 62           | 124      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.49 KB   |
| 327 |      | TRIANGLES | 1              | 248          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.84 KB   |
| 328 |      | TRIANGLES | 1              | 992          | 1,488    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.34 KB  |
| 329 |      | TRIANGLES | 1              | 372          | 744      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.93 KB   |
| 330 |      | TRIANGLES | 1              | 248          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.84 KB   |
| 331 |      | TRIANGLES | 1              | 310          | 620      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 7.44 KB   |
| 332 |      | TRIANGLES | 1              | 372          | 744      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.93 KB   |
| 333 |      | TRIANGLES | 1              | 1,147        | 2,015    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 25.02 KB  |
| 334 |      | TRIANGLES | 1              | 992          | 1,488    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.34 KB  |
| 335 |      | TRIANGLES | 1              | 372          | 744      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.93 KB   |
| 336 |      | TRIANGLES | 1              | 1,984        | 2,976    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 38.69 KB  |
| 337 |      | TRIANGLES | 1              | 31,672       | 49,276   | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 9         | 1.03 MB   |
| 338 |      | TRIANGLES | 1              | 5,152        | 9,087    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 112.69 KB |
| 339 |      | TRIANGLES | 1              | 3,006        | 3,703    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 51.36 KB  |
| 340 |      | TRIANGLES | 1              | 1,200        | 1,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 18.58 KB  |
| 341 |      | TRIANGLES | 1              | 338          | 362      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 5.29 KB   |
| 342 |      | TRIANGLES | 1              | 129          | 205      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.62 KB   |
| 343 |      | TRIANGLES | 1              | 782          | 1,180    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 9         | 24.75 KB  |
| 344 |      | TRIANGLES | 1              | 122          | 206      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.59 KB   |
| 345 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 48 Bytes  |
| 346 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.15 KB   |
| 347 |      | TRIANGLES | 1              | 816          | 430      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.77 KB   |
| 348 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 276 Bytes |
| 349 |      | TRIANGLES | 1              | 1,000        | 520      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 10.68 KB  |
| 350 |      | TRIANGLES | 1              | 5,296        | 2,750    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 56.53 KB  |
| 351 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.3 KB    |
| 352 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.3 KB    |
| 353 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 276 Bytes |
| 354 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.49 KB   |
| 355 |      | TRIANGLES | 1              | 2,646        | 1,425    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.7 KB   |
| 356 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 57.43 KB  |
| 357 |      | TRIANGLES | 1              | 2,446        | 1,348    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 26.81 KB  |
| 358 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 276 Bytes |
| 359 |      | TRIANGLES | 1              | 820          | 470      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 9.15 KB   |
| 360 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.3 KB    |
| 361 |      | TRIANGLES | 1              | 2,646        | 1,425    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.7 KB   |
| 362 |      | TRIANGLES | 1              | 816          | 430      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.77 KB   |
| 363 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.3 KB    |
| 364 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.3 KB    |
| 365 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 276 Bytes |
| 366 |      | TRIANGLES | 1              | 780          | 400      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.28 KB   |
| 367 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 276 Bytes |
| 368 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.49 KB   |
| 369 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.25 KB  |
| 370 |      | TRIANGLES | 1              | 2,646        | 1,400    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.48 KB  |
| 371 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 276 Bytes |
| 372 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.49 KB   |
| 373 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.25 KB  |
| 374 |      | TRIANGLES | 1              | 2,646        | 1,425    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.7 KB   |
| 375 |      | TRIANGLES | 1              | 746          | 475      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.75 KB   |
| 376 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 276 Bytes |
| 377 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.49 KB   |
| 378 |      | TRIANGLES | 1              | 5,296        | 2,750    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 56.53 KB  |
| 379 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 57.43 KB  |
| 380 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.25 KB  |
| 381 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 276 Bytes |
| 382 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.49 KB   |
| 383 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 8.3 KB    |
| 384 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 57.43 KB  |
| 385 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 57.43 KB  |
| 386 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.25 KB  |
| 387 |      | TRIANGLES | 1              | 2,646        | 1,400    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.48 KB  |
| 388 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 28.25 KB  |
| 389 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 33.91 KB  |
| 390 |      | TRIANGLES | 1              | 116          | 186      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.37 KB   |
| 391 |      | TRIANGLES | 1              | 890          | 1,426    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 9         | 29.58 KB  |
| 392 |      | TRIANGLES | 1              | 170          | 322      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 3.92 KB   |
| 393 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 96 Bytes  |
| 394 |      | TRIANGLES | 1              | 716          | 1,114    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 9         | 23.23 KB  |
| 395 |      | TRIANGLES | 1              | 120          | 194      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.47 KB   |
| 396 |      | TRIANGLES | 1              | 50           | 100      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.2 KB    |
| 397 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 48 Bytes  |
| 398 |      | TRIANGLES | 1              | 716          | 1,114    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 27        | 23.23 KB  |
| 399 |      | TRIANGLES | 1              | 116          | 186      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 2.37 KB   |
| 400 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 1.15 KB   |
| 401 |      | TRIANGLES | 1              | 6            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 144 Bytes |
| 402 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 48 Bytes  |
| 403 |      | TRIANGLES | 1              | 726          | 1,134    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 9         | 23.63 KB  |
| 404 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 405 |      | TRIANGLES | 1              | 112          | 178      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.27 KB   |
| 406 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.15 KB   |
| 407 |      | TRIANGLES | 1              | 714          | 1,110    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 27        | 23.15 KB  |
| 408 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 48 Bytes  |
| 409 |      | TRIANGLES | 1              | 124          | 202      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 2.56 KB   |
| 410 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 1.15 KB   |
| 411 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 33.91 KB  |
| 412 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 33.91 KB  |
| 413 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 33.91 KB  |
| 414 |      | TRIANGLES | 1              | 574          | 376      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 6.83 KB   |
| 415 |      | TRIANGLES | 1              | 133          | 139      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.05 KB   |
| 416 |      | TRIANGLES | 1              | 456          | 488      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 7.13 KB   |
| 417 |      | TRIANGLES | 1              | 456          | 488      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 7.13 KB   |
| 418 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 9         | 64 Bytes  |
| 419 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.15 KB   |
| 420 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 360 Bytes |
| 421 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 422 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 9         | 64 Bytes  |
| 423 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.12 KB   |
| 424 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 408 Bytes |
| 425 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 426 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 64 Bytes  |
| 427 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 64 Bytes  |
| 428 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.12 KB   |
| 429 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 408 Bytes |
| 430 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 17        | 48 Bytes  |
| 431 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 64 Bytes  |
| 432 |      | TRIANGLES | 1              | 56           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.16 KB   |
| 433 |      | TRIANGLES | 1              | 23           | 35       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 453 Bytes |
| 434 |      | TRIANGLES | 1              | 34           | 36       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 528 Bytes |
| 435 |      | TRIANGLES | 1              | 294          | 332      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 9         | 6.08 KB   |
| 436 |      | TRIANGLES | 1              | 140          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.75 KB   |
| 437 |      | TRIANGLES | 1              | 76           | 80       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.18 KB   |
| 438 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 144       | 192 Bytes |
| 439 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 408 Bytes |
| 440 |      | TRIANGLES | 1              | 206          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 3.61 KB   |
| 441 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 64 Bytes  |
| 442 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 64 Bytes  |
| 443 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.12 KB   |
| 444 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 408 Bytes |
| 445 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 446 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 64 Bytes  |
| 447 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 240 Bytes |
| 448 |      | TRIANGLES | 1              | 60           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.22 KB   |
| 449 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 450 |      | TRIANGLES | 1              | 20           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 372 Bytes |
| 451 |      | TRIANGLES | 1              | 50           | 84       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.06 KB   |
| 452 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 453 |      | TRIANGLES | 1              | 458          | 580      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 7.97 KB   |
| 454 |      | TRIANGLES | 1              | 18           | 36       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 432 Bytes |
| 455 |      | TRIANGLES | 1              | 40           | 64       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 816 Bytes |
| 456 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 240 Bytes |
| 457 |      | TRIANGLES | 1              | 14           | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 192 Bytes |
| 458 |      | TRIANGLES | 1              | 230          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 3.29 KB   |
| 459 |      | TRIANGLES | 1              | 198          | 164      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.66 KB   |
| 460 |      | TRIANGLES | 1              | 20           | 40       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 480 Bytes |
| 461 |      | TRIANGLES | 1              | 168          | 360      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 4.25 KB   |
| 462 |      | TRIANGLES | 1              | 28           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 420 Bytes |
| 463 |      | TRIANGLES | 1              | 24           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 432 Bytes |
| 464 |      | TRIANGLES | 1              | 120          | 240      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 2.88 KB   |
| 465 |      | TRIANGLES | 1              | 168          | 336      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 4.03 KB   |
| 466 |      | TRIANGLES | 1              | 120          | 144      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 2.02 KB   |
| 467 |      | TRIANGLES | 1              | 170          | 148      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 18        | 3.54 KB   |
| 468 |      | TRIANGLES | 1              | 972          | 1,048    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 15.26 KB  |
| 469 |      | TRIANGLES | 1              | 56           | 90       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.15 KB   |
| 470 |      | TRIANGLES | 1              | 144          | 218      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.83 KB   |
| 471 |      | TRIANGLES | 1              | 13           | 15       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 213 Bytes |
| 472 |      | TRIANGLES | 1              | 14           | 14       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 210 Bytes |
| 473 |      | TRIANGLES | 1              | 5            | 7        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 93 Bytes  |
| 474 |      | TRIANGLES | 1              | 73           | 75       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.11 KB   |
| 475 |      | TRIANGLES | 1              | 39           | 45       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 639 Bytes |
| 476 |      | TRIANGLES | 1              | 40           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 636 Bytes |
| 477 |      | TRIANGLES | 1              | 26           | 30       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 426 Bytes |
| 478 |      | TRIANGLES | 1              | 31           | 37       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 519 Bytes |
| 479 |      | TRIANGLES | 1              | 73           | 75       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.11 KB   |
| 480 |      | TRIANGLES | 1              | 13           | 15       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 213 Bytes |
| 481 |      | TRIANGLES | 1              | 14           | 14       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 210 Bytes |
| 482 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.15 KB   |
| 483 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 360 Bytes |
| 484 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48 Bytes  |
| 485 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 9         | 64 Bytes  |
| 486 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 9         | 160 Bytes |
| 487 |      | TRIANGLES | 1              | 70           | 140      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.68 KB   |
| 488 |      | TRIANGLES | 1              | 278          | 450      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 5.72 KB   |
| 489 |      | TRIANGLES | 1              | 37           | 49       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 663 Bytes |
| 490 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 156 Bytes |
| 491 |      | TRIANGLES | 1              | 332          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 5.34 KB   |
| 492 |      | TRIANGLES | 1              | 132          | 190      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.5 KB    |
| 493 |      | TRIANGLES | 1              | 150          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 2.81 KB   |
| 494 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 36        | 288 Bytes |
| 495 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 36        | 624 Bytes |
| 496 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 288 Bytes |
| 497 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 807 Bytes |
| 498 |      | TRIANGLES | 1              | 182          | 254      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 27        | 5.41 KB   |
| 499 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 27        | 156 Bytes |
| 500 |      | TRIANGLES | 1              | 64           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 1.25 KB   |
| 501 |      | TRIANGLES | 1              | 6            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 108 Bytes |
| 502 |      | TRIANGLES | 1              | 22           | 40       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 9         | 492 Bytes |
| 503 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 276 Bytes |
| 504 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 276 Bytes |
| 505 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 48 Bytes  |
| 506 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 48 Bytes  |
| 507 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 8         | 64 Bytes  |
| 508 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 8         | 64 Bytes  |
| 509 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 8         | 64 Bytes  |
| 510 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 8         | 64 Bytes  |
| 511 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 8         | 64 Bytes  |
| 512 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 48 Bytes  |
| 513 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 8         | 64 Bytes  |
| 514 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 48 Bytes  |
| 515 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 48 Bytes  |
| 516 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 1.15 KB   |
| 517 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 360 Bytes |
| 518 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 8         | 48 Bytes  |
| 519 |      | TRIANGLES | 1              | 1,463        | 1,529    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 22.54 KB  |
| 520 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 704 Bytes |
| 521 |      | TRIANGLES | 1              | 484          | 814      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 10.23 KB  |
| 522 |      | TRIANGLES | 1              | 198          | 308      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.96 KB   |
| 523 |      | TRIANGLES | 1              | 594          | 968      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.28 KB  |
| 524 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 704 Bytes |
| 525 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 526 |      | TRIANGLES | 1              | 66           | 132      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.58 KB   |
| 527 |      | TRIANGLES | 1              | 594          | 968      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.28 KB  |
| 528 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 529 |      | TRIANGLES | 1              | 220          | 352      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.49 KB   |
| 530 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 704 Bytes |
| 531 |      | TRIANGLES | 1              | 836          | 880      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.94 KB  |
| 532 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 533 |      | TRIANGLES | 1              | 253          | 385      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.98 KB   |
| 534 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 535 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 536 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 537 |      | TRIANGLES | 1              | 616          | 1,012    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.8 KB   |
| 538 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 539 |      | TRIANGLES | 1              | 374          | 396      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.81 KB   |
| 540 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 541 |      | TRIANGLES | 1              | 1,540        | 2,288    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 29.83 KB  |
| 542 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 543 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 544 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 704 Bytes |
| 545 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 546 |      | TRIANGLES | 1              | 550          | 924      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.62 KB  |
| 547 |      | TRIANGLES | 1              | 594          | 968      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.28 KB  |
| 548 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 549 |      | TRIANGLES | 1              | 110          | 220      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.64 KB   |
| 550 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 551 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 552 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 553 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 554 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 555 |      | TRIANGLES | 1              | 66           | 132      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.58 KB   |
| 556 |      | TRIANGLES | 1              | 660          | 1,056    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.46 KB  |
| 557 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 558 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 559 |      | TRIANGLES | 1              | 220          | 308      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.09 KB   |
| 560 |      | TRIANGLES | 1              | 220          | 352      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.49 KB   |
| 561 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 562 |      | TRIANGLES | 1              | 88           | 176      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.11 KB   |
| 563 |      | TRIANGLES | 1              | 594          | 968      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.28 KB  |
| 564 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 565 |      | TRIANGLES | 1              | 44           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 1.76 KB   |
| 566 |      | TRIANGLES | 1              | 506          | 1,012    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 12.14 KB  |
| 567 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 568 |      | TRIANGLES | 1              | 198          | 308      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.96 KB   |
| 569 |      | TRIANGLES | 1              | 264          | 385      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 5.05 KB   |
| 570 |      | TRIANGLES | 1              | 88           | 132      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.72 KB   |
| 571 |      | TRIANGLES | 1              | 1,650        | 2,292    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 30.53 KB  |
| 572 |      | TRIANGLES | 1              | 132          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.17 KB   |
| 573 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 704 Bytes |
| 574 |      | TRIANGLES | 1              | 352          | 528      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.86 KB   |
| 575 |      | TRIANGLES | 1              | 352          | 528      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.86 KB   |
| 576 |      | TRIANGLES | 1              | 132          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.17 KB   |
| 577 |      | TRIANGLES | 1              | 407          | 715      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.88 KB   |
| 578 |      | TRIANGLES | 1              | 132          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.17 KB   |
| 579 |      | TRIANGLES | 1              | 682          | 1,496    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 29.52 KB  |
| 580 |      | TRIANGLES | 1              | 88           | 132      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.72 KB   |
| 581 |      | TRIANGLES | 1              | 2,420        | 2,640    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 38.28 KB  |
| 582 |      | TRIANGLES | 1              | 407          | 715      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.88 KB   |
| 583 |      | TRIANGLES | 1              | 22           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 528 Bytes |
| 584 |      | TRIANGLES | 1              | 88           | 132      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.72 KB   |
| 585 |      | TRIANGLES | 1              | 352          | 528      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.86 KB   |
| 586 |      | TRIANGLES | 1              | 132          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.17 KB   |
| 587 |      | TRIANGLES | 1              | 88           | 132      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.72 KB   |
| 588 |      | TRIANGLES | 1              | 110          | 220      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 2.64 KB   |
| 589 |      | TRIANGLES | 1              | 132          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.17 KB   |
| 590 |      | TRIANGLES | 1              | 407          | 715      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 8.88 KB   |
| 591 |      | TRIANGLES | 1              | 352          | 528      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.86 KB   |
| 592 |      | TRIANGLES | 1              | 132          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.17 KB   |
| 593 |      | TRIANGLES | 1              | 704          | 1,056    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.73 KB  |
| 594 |      | TRIANGLES | 1              | 2,152        | 2,886    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 25        | 38.89 KB  |
| 595 |      | TRIANGLES | 1              | 36           | 54       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 25        | 702 Bytes |
| 596 |      | TRIANGLES | 1              | 36           | 52       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 50        | 684 Bytes |
| 597 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 48        | 48 Bytes  |
| 598 |      | TRIANGLES | 1              | 437          | 340      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 2,100     | 5.68 KB   |
| 599 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 2         | 48 Bytes  |
| 600 |      | TRIANGLES | 1              | 31,672       | 49,276   | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 1.03 MB   |
| 601 |      | TRIANGLES | 1              | 5,152        | 9,087    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 112.69 KB |
| 602 |      | TRIANGLES | 1              | 3,006        | 3,703    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 51.36 KB  |
| 603 |      | TRIANGLES | 1              | 1,200        | 1,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 18.58 KB  |
| 604 |      | TRIANGLES | 1              | 338          | 362      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 5.29 KB   |
| 605 |      | TRIANGLES | 1              | 129          | 205      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.62 KB   |
| 606 |      | TRIANGLES | 1              | 782          | 1,180    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 24.75 KB  |
| 607 |      | TRIANGLES | 1              | 122          | 206      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.59 KB   |
| 608 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 609 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.15 KB   |
| 610 |      | TRIANGLES | 1              | 816          | 430      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.77 KB   |
| 611 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 612 |      | TRIANGLES | 1              | 1,000        | 520      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 10.68 KB  |
| 613 |      | TRIANGLES | 1              | 5,296        | 2,750    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 56.53 KB  |
| 614 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.3 KB    |
| 615 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.3 KB    |
| 616 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 617 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.49 KB   |
| 618 |      | TRIANGLES | 1              | 2,646        | 1,425    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.7 KB   |
| 619 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 57.43 KB  |
| 620 |      | TRIANGLES | 1              | 2,446        | 1,348    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 26.81 KB  |
| 621 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 622 |      | TRIANGLES | 1              | 820          | 470      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 9.15 KB   |
| 623 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.3 KB    |
| 624 |      | TRIANGLES | 1              | 2,646        | 1,425    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.7 KB   |
| 625 |      | TRIANGLES | 1              | 816          | 430      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.77 KB   |
| 626 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.3 KB    |
| 627 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.3 KB    |
| 628 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 629 |      | TRIANGLES | 1              | 780          | 400      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.28 KB   |
| 630 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 631 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.49 KB   |
| 632 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.25 KB  |
| 633 |      | TRIANGLES | 1              | 2,646        | 1,400    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.48 KB  |
| 634 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 635 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.49 KB   |
| 636 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.25 KB  |
| 637 |      | TRIANGLES | 1              | 2,646        | 1,425    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.7 KB   |
| 638 |      | TRIANGLES | 1              | 746          | 475      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.75 KB   |
| 639 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 640 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.49 KB   |
| 641 |      | TRIANGLES | 1              | 5,296        | 2,750    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 56.53 KB  |
| 642 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 57.43 KB  |
| 643 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.25 KB  |
| 644 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 276 Bytes |
| 645 |      | TRIANGLES | 1              | 800          | 410      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.49 KB   |
| 646 |      | TRIANGLES | 1              | 746          | 425      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 8.3 KB    |
| 647 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 57.43 KB  |
| 648 |      | TRIANGLES | 1              | 5,296        | 2,850    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 57.43 KB  |
| 649 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.25 KB  |
| 650 |      | TRIANGLES | 1              | 2,646        | 1,400    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.48 KB  |
| 651 |      | TRIANGLES | 1              | 2,646        | 1,375    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 28.25 KB  |
| 652 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 33.91 KB  |
| 653 |      | TRIANGLES | 1              | 116          | 186      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.37 KB   |
| 654 |      | TRIANGLES | 1              | 890          | 1,426    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 29.58 KB  |
| 655 |      | TRIANGLES | 1              | 170          | 322      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 3.92 KB   |
| 656 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 96 Bytes  |
| 657 |      | TRIANGLES | 1              | 716          | 1,114    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 23.23 KB  |
| 658 |      | TRIANGLES | 1              | 120          | 194      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.47 KB   |
| 659 |      | TRIANGLES | 1              | 50           | 100      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.2 KB    |
| 660 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 661 |      | TRIANGLES | 1              | 716          | 1,114    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 18        | 23.23 KB  |
| 662 |      | TRIANGLES | 1              | 116          | 186      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 2.37 KB   |
| 663 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.15 KB   |
| 664 |      | TRIANGLES | 1              | 6            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 144 Bytes |
| 665 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 666 |      | TRIANGLES | 1              | 726          | 1,134    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 23.63 KB  |
| 667 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 668 |      | TRIANGLES | 1              | 112          | 178      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.27 KB   |
| 669 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.15 KB   |
| 670 |      | TRIANGLES | 1              | 714          | 1,110    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 18        | 23.15 KB  |
| 671 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 48 Bytes  |
| 672 |      | TRIANGLES | 1              | 124          | 202      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 2.56 KB   |
| 673 |      | TRIANGLES | 1              | 48           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 1.15 KB   |
| 674 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 33.91 KB  |
| 675 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 33.91 KB  |
| 676 |      | TRIANGLES | 1              | 3,176        | 1,650    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 33.91 KB  |
| 677 |      | TRIANGLES | 1              | 574          | 376      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 6.83 KB   |
| 678 |      | TRIANGLES | 1              | 133          | 139      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.05 KB   |
| 679 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 680 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.15 KB   |
| 681 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 360 Bytes |
| 682 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 683 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 684 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.12 KB   |
| 685 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 408 Bytes |
| 686 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 12        | 48 Bytes  |
| 687 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 688 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 689 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.12 KB   |
| 690 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 408 Bytes |
| 691 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 692 |      | TRIANGLES | 1              | 56           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.16 KB   |
| 693 |      | TRIANGLES | 1              | 23           | 35       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 453 Bytes |
| 694 |      | TRIANGLES | 1              | 34           | 36       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 528 Bytes |
| 695 |      | TRIANGLES | 1              | 140          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.75 KB   |
| 696 |      | TRIANGLES | 1              | 76           | 80       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.18 KB   |
| 697 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 96        | 192 Bytes |
| 698 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 408 Bytes |
| 699 |      | TRIANGLES | 1              | 206          | 264      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 3.61 KB   |
| 700 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 701 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 702 |      | TRIANGLES | 1              | 54           | 88       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.12 KB   |
| 703 |      | TRIANGLES | 1              | 20           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 408 Bytes |
| 704 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 705 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 706 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 240 Bytes |
| 707 |      | TRIANGLES | 1              | 60           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.22 KB   |
| 708 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 709 |      | TRIANGLES | 1              | 20           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 372 Bytes |
| 710 |      | TRIANGLES | 1              | 50           | 84       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.06 KB   |
| 711 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 712 |      | TRIANGLES | 1              | 458          | 580      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 7.97 KB   |
| 713 |      | TRIANGLES | 1              | 18           | 36       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 432 Bytes |
| 714 |      | TRIANGLES | 1              | 40           | 64       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 816 Bytes |
| 715 |      | TRIANGLES | 1              | 10           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 240 Bytes |
| 716 |      | TRIANGLES | 1              | 14           | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 192 Bytes |
| 717 |      | TRIANGLES | 1              | 230          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 3.29 KB   |
| 718 |      | TRIANGLES | 1              | 198          | 164      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.66 KB   |
| 719 |      | TRIANGLES | 1              | 20           | 40       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 480 Bytes |
| 720 |      | TRIANGLES | 1              | 168          | 360      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 4.25 KB   |
| 721 |      | TRIANGLES | 1              | 28           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 420 Bytes |
| 722 |      | TRIANGLES | 1              | 24           | 32       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 432 Bytes |
| 723 |      | TRIANGLES | 1              | 120          | 240      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 12        | 2.88 KB   |
| 724 |      | TRIANGLES | 1              | 168          | 336      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 12        | 4.03 KB   |
| 725 |      | TRIANGLES | 1              | 120          | 144      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 12        | 2.02 KB   |
| 726 |      | TRIANGLES | 1              | 170          | 148      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 12        | 3.54 KB   |
| 727 |      | TRIANGLES | 1              | 972          | 1,048    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 15.26 KB  |
| 728 |      | TRIANGLES | 1              | 56           | 90       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.15 KB   |
| 729 |      | TRIANGLES | 1              | 144          | 218      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.83 KB   |
| 730 |      | TRIANGLES | 1              | 13           | 15       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 213 Bytes |
| 731 |      | TRIANGLES | 1              | 14           | 14       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 210 Bytes |
| 732 |      | TRIANGLES | 1              | 5            | 7        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 93 Bytes  |
| 733 |      | TRIANGLES | 1              | 73           | 75       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.11 KB   |
| 734 |      | TRIANGLES | 1              | 39           | 45       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 639 Bytes |
| 735 |      | TRIANGLES | 1              | 40           | 44       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 636 Bytes |
| 736 |      | TRIANGLES | 1              | 26           | 30       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 426 Bytes |
| 737 |      | TRIANGLES | 1              | 31           | 37       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 519 Bytes |
| 738 |      | TRIANGLES | 1              | 73           | 75       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.11 KB   |
| 739 |      | TRIANGLES | 1              | 13           | 15       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 213 Bytes |
| 740 |      | TRIANGLES | 1              | 14           | 14       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 210 Bytes |
| 741 |      | TRIANGLES | 1              | 54           | 92       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.15 KB   |
| 742 |      | TRIANGLES | 1              | 18           | 28       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 360 Bytes |
| 743 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 48 Bytes  |
| 744 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 6         | 64 Bytes  |
| 745 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 6         | 160 Bytes |
| 746 |      | TRIANGLES | 1              | 70           | 140      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.68 KB   |
| 747 |      | TRIANGLES | 1              | 278          | 450      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 5.72 KB   |
| 748 |      | TRIANGLES | 1              | 37           | 49       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 663 Bytes |
| 749 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 156 Bytes |
| 750 |      | TRIANGLES | 1              | 332          | 372      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 12        | 5.34 KB   |
| 751 |      | TRIANGLES | 1              | 132          | 190      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 2.5 KB    |
| 752 |      | TRIANGLES | 1              | 150          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 2         | 2.81 KB   |
| 753 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 24        | 288 Bytes |
| 754 |      | TRIANGLES | 1              | 32           | 48       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 24        | 624 Bytes |
| 755 |      | TRIANGLES | 1              | 12           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 12        | 288 Bytes |
| 756 |      | TRIANGLES | 1              | 37           | 65       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 807 Bytes |
| 757 |      | TRIANGLES | 1              | 8            | 12       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 18        | 156 Bytes |
| 758 |      | TRIANGLES | 1              | 64           | 96       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 1.25 KB   |
| 759 |      | TRIANGLES | 1              | 6            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 108 Bytes |
| 760 |      | TRIANGLES | 1              | 22           | 40       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 6         | 492 Bytes |
| 761 |      | TRIANGLES | 1              | 9,842        | 10,286   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 151.63 KB |
| 762 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 4.74 KB   |
| 763 |      | TRIANGLES | 1              | 3,256        | 5,476    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 68.82 KB  |
| 764 |      | TRIANGLES | 1              | 1,332        | 2,072    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.64 KB  |
| 765 |      | TRIANGLES | 1              | 3,996        | 6,512    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 82.58 KB  |
| 766 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 4.74 KB   |
| 767 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 768 |      | TRIANGLES | 1              | 444          | 888      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 10.66 KB  |
| 769 |      | TRIANGLES | 1              | 3,996        | 6,512    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 82.58 KB  |
| 770 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 771 |      | TRIANGLES | 1              | 1,480        | 2,368    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 30.19 KB  |
| 772 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 4.74 KB   |
| 773 |      | TRIANGLES | 1              | 5,624        | 5,920    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 87.02 KB  |
| 774 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 775 |      | TRIANGLES | 1              | 1,702        | 2,590    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 33.52 KB  |
| 776 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 777 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 778 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 779 |      | TRIANGLES | 1              | 4,144        | 6,808    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 86.14 KB  |
| 780 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 781 |      | TRIANGLES | 1              | 2,516        | 2,664    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 39.07 KB  |
| 782 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 783 |      | TRIANGLES | 1              | 10,360       | 15,392   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 200.69 KB |
| 784 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 785 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 786 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 4.74 KB   |
| 787 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 788 |      | TRIANGLES | 1              | 3,700        | 6,216    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 78.14 KB  |
| 789 |      | TRIANGLES | 1              | 3,996        | 6,512    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 82.58 KB  |
| 790 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 791 |      | TRIANGLES | 1              | 740          | 1,480    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 17.76 KB  |
| 792 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 793 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 794 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 795 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 796 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 797 |      | TRIANGLES | 1              | 444          | 888      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 10.66 KB  |
| 798 |      | TRIANGLES | 1              | 4,440        | 7,104    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 90.58 KB  |
| 799 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 800 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 801 |      | TRIANGLES | 1              | 1,480        | 2,072    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 27.53 KB  |
| 802 |      | TRIANGLES | 1              | 1,480        | 2,368    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 30.19 KB  |
| 803 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 804 |      | TRIANGLES | 1              | 592          | 1,184    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 14.21 KB  |
| 805 |      | TRIANGLES | 1              | 3,996        | 6,512    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 82.58 KB  |
| 806 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 807 |      | TRIANGLES | 1              | 296          | 592      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 11.84 KB  |
| 808 |      | TRIANGLES | 1              | 3,404        | 6,808    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 81.7 KB   |
| 809 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 810 |      | TRIANGLES | 1              | 1,332        | 2,072    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.64 KB  |
| 811 |      | TRIANGLES | 1              | 1,776        | 2,590    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 33.97 KB  |
| 812 |      | TRIANGLES | 1              | 592          | 888      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.54 KB  |
| 813 |      | TRIANGLES | 1              | 11,100       | 15,396   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 205.16 KB |
| 814 |      | TRIANGLES | 1              | 888          | 1,776    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.31 KB  |
| 815 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 4.74 KB   |
| 816 |      | TRIANGLES | 1              | 2,368        | 3,552    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 46.18 KB  |
| 817 |      | TRIANGLES | 1              | 2,368        | 3,552    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 46.18 KB  |
| 818 |      | TRIANGLES | 1              | 888          | 1,776    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.31 KB  |
| 819 |      | TRIANGLES | 1              | 2,738        | 4,810    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 59.72 KB  |
| 820 |      | TRIANGLES | 1              | 888          | 1,776    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.31 KB  |
| 821 |      | TRIANGLES | 1              | 4,588        | 10,064   | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 198.62 KB |
| 822 |      | TRIANGLES | 1              | 592          | 888      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.54 KB  |
| 823 |      | TRIANGLES | 1              | 16,280       | 17,760   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 257.52 KB |
| 824 |      | TRIANGLES | 1              | 2,738        | 4,810    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 59.72 KB  |
| 825 |      | TRIANGLES | 1              | 148          | 296      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 3.55 KB   |
| 826 |      | TRIANGLES | 1              | 592          | 888      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.54 KB  |
| 827 |      | TRIANGLES | 1              | 2,368        | 3,552    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 46.18 KB  |
| 828 |      | TRIANGLES | 1              | 888          | 1,776    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.31 KB  |
| 829 |      | TRIANGLES | 1              | 592          | 888      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 11.54 KB  |
| 830 |      | TRIANGLES | 1              | 740          | 1,480    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 17.76 KB  |
| 831 |      | TRIANGLES | 1              | 888          | 1,776    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.31 KB  |
| 832 |      | TRIANGLES | 1              | 2,738        | 4,810    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 59.72 KB  |
| 833 |      | TRIANGLES | 1              | 2,368        | 3,552    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 46.18 KB  |
| 834 |      | TRIANGLES | 1              | 888          | 1,776    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.31 KB  |
| 835 |      | TRIANGLES | 1              | 4,736        | 7,104    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 92.35 KB  |
| 836 |      | TRIANGLES | 1              | 18,088       | 18,904   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 278.66 KB |
| 837 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 8.7 KB    |
| 838 |      | TRIANGLES | 1              | 5,984        | 10,064   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 126.48 KB |
| 839 |      | TRIANGLES | 1              | 2,448        | 3,808    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48.96 KB  |
| 840 |      | TRIANGLES | 1              | 7,344        | 11,992   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 151.99 KB |
| 841 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 8.7 KB    |
| 842 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 843 |      | TRIANGLES | 1              | 816          | 1,632    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.58 KB  |
| 844 |      | TRIANGLES | 1              | 7,344        | 11,968   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 151.78 KB |
| 845 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 846 |      | TRIANGLES | 1              | 2,720        | 4,352    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 55.49 KB  |
| 847 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 8.7 KB    |
| 848 |      | TRIANGLES | 1              | 10,336       | 10,880   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 159.94 KB |
| 849 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 850 |      | TRIANGLES | 1              | 3,128        | 4,760    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 61.61 KB  |
| 851 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 852 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 853 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 854 |      | TRIANGLES | 1              | 7,616        | 12,512   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 158.3 KB  |
| 855 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 856 |      | TRIANGLES | 1              | 4,624        | 4,896    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 71.81 KB  |
| 857 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 858 |      | TRIANGLES | 1              | 19,040       | 28,288   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 368.83 KB |
| 859 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 860 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 861 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 8.7 KB    |
| 862 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 863 |      | TRIANGLES | 1              | 6,800        | 11,424   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 143.62 KB |
| 864 |      | TRIANGLES | 1              | 7,344        | 11,992   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 151.99 KB |
| 865 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 866 |      | TRIANGLES | 1              | 1,360        | 2,720    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 32.64 KB  |
| 867 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 868 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 869 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 870 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 871 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 872 |      | TRIANGLES | 1              | 816          | 1,632    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.58 KB  |
| 873 |      | TRIANGLES | 1              | 8,160        | 13,056   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 166.46 KB |
| 874 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 875 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 876 |      | TRIANGLES | 1              | 2,720        | 3,808    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 50.59 KB  |
| 877 |      | TRIANGLES | 1              | 2,720        | 4,352    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 55.49 KB  |
| 878 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 879 |      | TRIANGLES | 1              | 1,088        | 2,176    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 26.11 KB  |
| 880 |      | TRIANGLES | 1              | 7,344        | 11,968   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 151.78 KB |
| 881 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 882 |      | TRIANGLES | 1              | 544          | 1,088    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 21.76 KB  |
| 883 |      | TRIANGLES | 1              | 6,256        | 12,512   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 150.14 KB |
| 884 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 885 |      | TRIANGLES | 1              | 2,448        | 3,808    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 48.96 KB  |
| 886 |      | TRIANGLES | 1              | 3,264        | 4,760    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 62.42 KB  |
| 887 |      | TRIANGLES | 1              | 1,088        | 1,632    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.22 KB  |
| 888 |      | TRIANGLES | 1              | 20,400       | 28,336   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 377.42 KB |
| 889 |      | TRIANGLES | 1              | 1,632        | 3,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 39.17 KB  |
| 890 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 1         | 8.7 KB    |
| 891 |      | TRIANGLES | 1              | 4,352        | 6,528    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 84.86 KB  |
| 892 |      | TRIANGLES | 1              | 4,352        | 6,528    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 84.86 KB  |
| 893 |      | TRIANGLES | 1              | 1,632        | 3,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 39.17 KB  |
| 894 |      | TRIANGLES | 1              | 5,032        | 8,840    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 109.75 KB |
| 895 |      | TRIANGLES | 1              | 1,632        | 3,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 39.17 KB  |
| 896 |      | TRIANGLES | 1              | 8,432        | 18,496   | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 365.02 KB |
| 897 |      | TRIANGLES | 1              | 1,088        | 1,632    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.22 KB  |
| 898 |      | TRIANGLES | 1              | 29,920       | 32,640   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 473.28 KB |
| 899 |      | TRIANGLES | 1              | 5,032        | 8,840    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 109.75 KB |
| 900 |      | TRIANGLES | 1              | 272          | 544      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.53 KB   |
| 901 |      | TRIANGLES | 1              | 1,088        | 1,632    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.22 KB  |
| 902 |      | TRIANGLES | 1              | 4,352        | 6,528    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 84.86 KB  |
| 903 |      | TRIANGLES | 1              | 1,632        | 3,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 39.17 KB  |
| 904 |      | TRIANGLES | 1              | 1,088        | 1,632    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 21.22 KB  |
| 905 |      | TRIANGLES | 1              | 1,360        | 2,720    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 32.64 KB  |
| 906 |      | TRIANGLES | 1              | 1,632        | 3,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 39.17 KB  |
| 907 |      | TRIANGLES | 1              | 5,032        | 8,840    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 109.75 KB |
| 908 |      | TRIANGLES | 1              | 4,352        | 6,528    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 84.86 KB  |
| 909 |      | TRIANGLES | 1              | 1,632        | 3,264    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 39.17 KB  |
| 910 |      | TRIANGLES | 1              | 8,704        | 13,056   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 169.73 KB |
| 911 |      | TRIANGLES | 1              | 60,270       | 120,540  | u32     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.81 MB   |
| 912 |      | TRIANGLES | 1              | 60,270       | 119,105  | u32     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.8 MB    |
| 913 |      | TRIANGLES | 1              | 60,270       | 119,105  | u32     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.8 MB    |
| 914 |      | TRIANGLES | 1              | 60,270       | 97,685   | u32     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.6 MB    |
| 915 |      | TRIANGLES | 1              | 60,270       | 97,633   | u32     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 1.6 MB    |
| 916 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 917 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 918 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 919 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 920 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 921 |      | TRIANGLES | 1              | 14,924       | 24,478   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 309.85 KB |
| 922 |      | TRIANGLES | 1              | 34,440       | 48,790   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 645.75 KB |
| 923 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 924 |      | TRIANGLES | 1              | 24,108       | 36,752   | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 475.42 KB |
| 925 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 926 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 927 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 928 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 929 |      | TRIANGLES | 1              | 574          | 1,148    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 13.78 KB  |
| 930 |      | TRIANGLES | 1              | 35           | 61       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 759 Bytes |
| 931 |      | TRIANGLES | 1              | 20           | 36       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 444 Bytes |
| 932 |      | TRIANGLES | 1              | 150          | 231      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 2         | 2.98 KB   |
| 933 |      | TRIANGLES | 1              | 13           | 17       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 2         | 231 Bytes |
| 934 |      | TRIANGLES | 1              | 4            | 6        | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:u16_norm | 2         | 102 Bytes |
| 935 |      | TRIANGLES | 1              | 150          | 212      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 4         | 2.81 KB   |
| 936 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 3         | 96 Bytes  |
| 937 |      | TRIANGLES | 1              | 2            | 4        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 3         | 48 Bytes  |
| 938 |      | TRIANGLES | 1              | 840          | 1,680    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 20.16 KB  |
| 939 |      | TRIANGLES | 1              | 840          | 1,660    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.98 KB  |
| 940 |      | TRIANGLES | 1              | 840          | 1,660    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 19.98 KB  |
| 941 |      | TRIANGLES | 1              | 840          | 1,360    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 17.28 KB  |
| 942 |      | TRIANGLES | 1              | 840          | 1,360    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 17.28 KB  |
| 943 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 944 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 945 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 946 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 947 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 948 |      | TRIANGLES | 1              | 208          | 344      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 4.34 KB   |
| 949 |      | TRIANGLES | 1              | 480          | 680      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 9 KB      |
| 950 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 951 |      | TRIANGLES | 1              | 336          | 512      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.62 KB   |
| 952 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 953 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 954 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 955 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 956 |      | TRIANGLES | 1              | 8            | 16       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 192 Bytes |
| 957 |      | TRIANGLES | 1              | 1,721        | 2,157    | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 29.74 KB  |
| 958 |      | TRIANGLES | 1              | 369          | 540      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 7.07 KB   |
| 959 |      | TRIANGLES | 1              | 1,101        | 1,363    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 29.78 KB  |
| 960 |      | TRIANGLES | 1              | 806          | 1,110    | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 23.71 KB  |
| 961 |      | TRIANGLES | 1              | 305          | 513      | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 6.45 KB   |
| 962 |      | TRIANGLES | 1              | 18           | 24       | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 324 Bytes |
| 963 |      | TRIANGLES | 1              | 12           | 18       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 378 Bytes |
| 964 |      | TRIANGLES | 1              | 45           | 69       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 1.44 KB   |
| 965 |      | TRIANGLES | 1              | 4            | 8        | u16     | NORMAL:i8_norm, POSITION:i16_norm                      | 1         | 96 Bytes  |
| 966 |      | TRIANGLES | 1              | 16           | 20       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 436 Bytes |
| 967 |      | TRIANGLES | 1              | 21           | 39       | u16     | NORMAL:i8_norm, POSITION:i16_norm, TEXCOORD_0:f32      | 1         | 789 Bytes |

⁴ size estimates GPU memory required by a mesh, in isolation. If accessors are
  shared by other mesh primitives, but the meshes themselves are not reused, then
  the sum of all mesh sizes will overestimate the asset's total size. See "dedup".



 MATERIALS
 ────────────────────────────────────────────
| #   | name                                      | instances | textures         | alphaMode | doubleSided |
| --- | ---                                       | ---       | ---              | ---       | ---         |
| 0   | Heather_Shirt                             | 1         |                  | MASK      | ✓           |
| 1   | Heather_PantShadow                        | 1         |                  | MASK      | ✓           |
| 2   | Heather_Band                              | 1         |                  | MASK      | ✓           |
| 3   | Heather_Stripe1                           | 1         |                  | MASK      | ✓           |
| 4   | Heather_Stripe2                           | 1         |                  | MASK      | ✓           |
| 5   | Heather_Hair                              | 1         |                  | MASK      | ✓           |
| 6   | Heather_Soles                             | 23        |                  | MASK      | ✓           |
| 7   | Heather_Jeans                             | 1         |                  | MASK      | ✓           |
| 8   | Heather_Hat                               | 1         |                  | MASK      | ✓           |
| 9   | Heather_Cuffs                             | 1         |                  | MASK      | ✓           |
| 10  | Heather_Shoes                             | 1         |                  | MASK      | ✓           |
| 11  | Heather_Brim                              | 1         |                  | MASK      | ✓           |
| 12  | Heather_Hair2                             | 1         |                  | MASK      | ✓           |
| 13  | Heather_ShirtShadow                       | 1         |                  | MASK      | ✓           |
| 14  | Heather_Skin                              | 1         |                  | MASK      | ✓           |
| 15  | Lily_Blonde                               | 1         |                  | MASK      | ✓           |
| 16  | Lily_Light                                | 1         |                  | MASK      | ✓           |
| 17  | Lily_Dark                                 | 1         |                  | MASK      | ✓           |
| 18  | Heather_Brim1                             | 1         |                  | MASK      | ✓           |
| 19  | Metal_Floor_Grid_01                       | 2         | baseColorTexture | MASK      | ✓           |
| 20  | Powder coating                            | 2         |                  | MASK      | ✓           |
| 21  | [Metal_Corrogated_Shiny]1                 | 1         | baseColorTexture | MASK      | ✓           |
| 22  | [0131_Silver]                             | 3         |                  | MASK      | ✓           |
| 23  | [Color_004]                               | 3         |                  | MASK      | ✓           |
| 24  | [Color_A01]                               | 1         |                  | MASK      | ✓           |
| 25  | [Color_F11]                               | 1         |                  | MASK      | ✓           |
| 26  | [Color_001]                               | 1         |                  | MASK      | ✓           |
| 27  | [Color_I11]                               | 1         |                  | MASK      | ✓           |
| 28  | [Color_000]1                              | 12        |                  | MASK      | ✓           |
| 29  |                                           | 133       |                  | OPAQUE    |             |
| 30  | *1                                        | 1         |                  | MASK      | ✓           |
| 31  | [Color M03]                               | 1         |                  | MASK      | ✓           |
| 32  | [Color F05]                               | 1         |                  | MASK      | ✓           |
| 33  | [Translucent Glass Gray]                  | 23        |                  | BLEND     | ✓           |
| 34  | <LightGray>1                              | 1         |                  | MASK      | ✓           |
| 35  | [Metal_Aluminum_Anodized]                 | 1         | baseColorTexture | MASK      | ✓           |
| 36  | [Color_002]                               | 3         |                  | MASK      | ✓           |
| 37  | [Metal_Corrogated_Shiny]                  | 1         | baseColorTexture | MASK      | ✓           |
| 38  | [Color M06]                               | 87        |                  | MASK      | ✓           |
| 39  | [Color_007]2                              | 50        |                  | MASK      | ✓           |
| 40  | [Color_005]                               | 14        |                  | MASK      | ✓           |
| 41  | *178                                      | 69        |                  | MASK      | ✓           |
| 42  | [Color M08]3                              | 92        |                  | MASK      | ✓           |
| 43  | NR900-L1                                  | 3         | baseColorTexture | MASK      | ✓           |
| 44  | *179                                      | 10        |                  | MASK      | ✓           |
| 45  | [Metal_Corrogated_Shiny]15                | 3         | baseColorTexture | MASK      | ✓           |
| 46  | Material-3202                             | 8         | baseColorTexture | MASK      | ✓           |
| 47  | 3                                         | 16        | baseColorTexture | MASK      | ✓           |
| 48  | Material-3246                             | 10        | baseColorTexture | MASK      | ✓           |
| 49  | [0136_Charcoal]2                          | 10        |                  | MASK      | ✓           |
| 50  | [Color_D02]2                              | 103       |                  | MASK      | ✓           |
| 51  | Material-3587                             | 9         | baseColorTexture | MASK      | ✓           |
| 52  | [Color M09]                               | 32        |                  | MASK      | ✓           |
| 53  | *182                                      | 8         | baseColorTexture | MASK      | ✓           |
| 54  | *180                                      | 8         |                  | MASK      | ✓           |
| 55  | *181                                      | 8         |                  | MASK      | ✓           |
| 56  | [Metal Corrugated Shiny]5                 | 20        | baseColorTexture | MASK      | ✓           |
| 57  | [Color E06]                               | 68        |                  | MASK      | ✓           |
| 58  | [Translucent Glass Gray]2                 | 8         |                  | BLEND     | ✓           |
| 59  | [Color A07]1                              | 47        |                  | MASK      | ✓           |
| 60  | [Color G07]                               | 7         |                  | MASK      | ✓           |
| 61  | [Color I04]                               | 10        |                  | MASK      | ✓           |
| 62  | Material-22608                            | 3         | baseColorTexture | MASK      | ✓           |
| 63  | Material-22635                            | 3         | baseColorTexture | MASK      | ✓           |
| 64  | Material-22958                            | 3         | baseColorTexture | MASK      | ✓           |
| 65  | Material-22985                            | 3         | baseColorTexture | MASK      | ✓           |
| 66  | [Color_F06]                               | 4         |                  | MASK      | ✓           |
| 67  | [Color_E02]                               | 2         |                  | MASK      | ✓           |
| 68  | [Metal_Steel_Textured_White]              | 2         | baseColorTexture | MASK      | ✓           |
| 69  | [Translucent Glass Dark Green]            | 2         |                  | BLEND     | ✓           |
| 70  | [Translucent Glass Blue]3                 | 1         |                  | BLEND     | ✓           |
| 71  | M09_Shadow_Night                          | 1         |                  | MASK      | ✓           |
| 72  | M00_Soft_Cloud                            | 2         |                  | MASK      | ✓           |
| 73  | [Chris_Shoe]                              | 1         |                  | MASK      | ✓           |
| 74  | Schermafbeelding 2021-02-05 om 13.16.25 1 | 1         | baseColorTexture | MASK      | ✓           |
| 75  | [White Square Tile]1                      | 1         | baseColorTexture | MASK      | ✓           |
| 76  | [Fencing Chain Link]                      | 1         | baseColorTexture | MASK      | ✓           |
| 77  | M06_Steel_Smoke                           | 1         |                  | MASK      | ✓           |
| 78  | [Tile Limestone Large]1                   | 1         | baseColorTexture | BLEND     | ✓           |
| 79  | [Color M08]                               | 1         |                  | MASK      | ✓           |
| 80  | [White Square Tile]2                      | 1         | baseColorTexture | MASK      | ✓           |
| 81  | Glass_Safety_01                           | 1         | baseColorTexture | BLEND     | ✓           |



 TEXTURES
 ────────────────────────────────────────────
| #   | name | uri | slots            | instances | mimeType   | compression | resolution | size      | gpuSize⁵  |
| --- | ---  | --- | ---              | ---       | ---        | ---         | ---        | ---       | ---       |
| 0   |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 3.17 KB   | 13.26 KB  |
| 1   |      |     | baseColorTexture | 4         | image/webp |             | 50x50      | 600 Bytes | 13.26 KB  |
| 2   |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 656 Bytes | 13.26 KB  |
| 3   |      |     | baseColorTexture | 1         | image/webp |             | 50x6       | 638 Bytes | 1.59 KB   |
| 4   |      |     | baseColorTexture | 1         | image/webp |             | 1084x375   | 27.23 KB  | 2.17 MB   |
| 5   |      |     | baseColorTexture | 1         | image/webp |             | 50x7       | 752 Bytes | 1.79 KB   |
| 6   |      |     | baseColorTexture | 1         | image/webp |             | 1857x189   | 53.43 KB  | 1.87 MB   |
| 7   |      |     | baseColorTexture | 1         | image/webp |             | 1072x218   | 34.98 KB  | 1.25 MB   |
| 8   |      |     | baseColorTexture | 1         | image/webp |             | 50x27      | 810 Bytes | 7.08 KB   |
| 9   |      |     | baseColorTexture | 1         | image/webp |             | 1450x132   | 18.98 KB  | 1.02 MB   |
| 10  |      |     | baseColorTexture | 1         | image/webp |             | 1170x144   | 13.45 KB  | 898.37 KB |
| 11  |      |     | baseColorTexture | 1         | image/webp |             | 745x135    | 11.87 KB  | 534.46 KB |
| 12  |      |     | baseColorTexture | 1         | image/webp |             | 662x64     | 6.29 KB   | 225.91 KB |
| 13  |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 1.29 KB   | 13.26 KB  |
| 14  |      |     | baseColorTexture | 1         | image/webp |             | 44x50      | 698 Bytes | 11.68 KB  |
| 15  |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 648 Bytes | 13.26 KB  |
| 16  |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 1.84 KB   | 13.26 KB  |
| 17  |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 648 Bytes | 13.26 KB  |
| 18  |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 648 Bytes | 13.26 KB  |
| 19  |      |     | baseColorTexture | 1         | image/webp |             | 50x50      | 1.31 KB   | 13.26 KB  |

⁵ gpuSize estimates minimum VRAM memory allocation. Older devices may require
  additional memory for GPU compression formats.



 ANIMATIONS
 ────────────────────────────────────────────
No animations found.

