export interface Passage {
  id: string;
  title: string;
  grade: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  text: string;
}

export const passages: Passage[] = [
  {
    id: "g2-farm",
    title: "The Farm",
    grade: 2,
    text: "The sun came up over the hill. The rooster began to crow loud and long. The farmer woke up and got dressed. He put on his boots and his hat. He went outside to feed the animals. First he fed the pigs their slop. Then he threw corn to the chickens. The horse got hay and fresh water. The cow needed to be milked too. The farmer sat on a small stool. He pulled and the milk came out. He filled a big silver bucket. The dog ran around the yard barking. It wanted to play with the farmer. But the farmer had too much work. He still needed to water the garden. The vegetables needed a lot of care. He carried a heavy can of water. He poured it on the beans and corn. Then he checked the tomatoes for bugs.",
  },
  {
    id: "g2-rain",
    title: "A Rainy Day",
    grade: 2,
    text: "The rain hit the window with a tap. Maria looked outside at the gray sky. She wanted to go out and play. But her mom said no, not today. So Maria sat down at the table. She got out her box of crayons. She drew a big yellow sun on paper. Then she drew a house with a red roof. She gave the house a brown front door. She put flowers around the whole yard. Her little brother came and sat with her. He wanted to draw a picture too. She gave him the blue and green crayons. He drew a boat on the water. Then he drew fish under the boat. Maria thought the fish looked really funny. She laughed and her brother laughed too. Their mom came in and saw their work. She said they were both very good artists. She hung both pictures up on the wall.",
  },
  {
    id: "g3-ocean",
    title: "The Ocean",
    grade: 3,
    text: "The ocean is one of the most amazing places on Earth. It covers more than half of our entire planet. Many different animals live beneath the waves. Some of them are tiny, like shrimp and small crabs. Others are enormous, like the blue whale, which is the largest animal alive. The water in the ocean is salty because rivers carry minerals from land. These minerals build up over millions of years. Ocean water also moves in big currents, like rivers flowing through the sea. These currents carry warm or cold water around the globe. They affect the weather and climate of nearby lands. People depend on the ocean for food, transportation, and even the air we breathe. Tiny plants called phytoplankton produce much of the world's oxygen. Without the ocean, life on land would be very different. Scientists are still discovering new creatures in the deep sea every year.",
  },
  {
    id: "g3-library",
    title: "The Library",
    grade: 3,
    text: "The library is a place where anyone can find a book to read. It is free to use and open to all members of the community. When you walk in, you see rows and rows of shelves filled with books. There are books about animals, history, science, and make-believe adventures. The librarian can help you find exactly what you are looking for. You just tell her the topic or the title you want. She can search the computer and tell you exactly where to look. Once you find a book you like, you can borrow it and take it home. Most libraries let you keep a book for two or three weeks. If you need more time, you can renew it at the front desk. Libraries also have magazines, DVDs, and computers for people to use. Many offer story time for young children on certain days. Some have quiet study rooms for students who need to concentrate. The library is a wonderful resource for everyone in the neighborhood.",
  },
  {
    id: "g4-wolves",
    title: "Wolves in the Wild",
    grade: 4,
    text: "Wolves are powerful animals that live in packs across North America, Europe, and Asia. A pack is a family group that hunts and travels together. Each pack has a leader called the alpha, which is usually the strongest adult pair. The other wolves follow the alpha's lead and obey the social order. Wolves communicate using howls, growls, barks, and body posture. A howl can travel several miles across open land, alerting distant pack members. They also use scent to mark their territory and warn other packs away. Wolves are skilled hunters that work as a team to bring down large prey like deer and elk. They will chase an animal for miles, testing its strength and speed before attacking. Wolves help keep ecosystems healthy by controlling deer populations. Without wolves, deer herds can grow too large and destroy forest vegetation. Scientists who reintroduced wolves to Yellowstone National Park saw major positive changes in the ecosystem. Rivers changed course because vegetation grew back, which shows how one species can reshape an entire landscape.",
  },
  {
    id: "g4-space",
    title: "Exploring Space",
    grade: 4,
    text: "Space exploration began in earnest during the 1950s when the Soviet Union launched the first satellite, Sputnik. This small metal sphere orbited Earth and changed history forever. Within a decade, humans were walking on the Moon. The Apollo 11 mission in 1969 carried Neil Armstrong and Buzz Aldrin to the lunar surface. Armstrong's first steps were watched by hundreds of millions of people on television. Since then, robots and spacecraft have visited every planet in our solar system. The Mars rovers have sent back incredible photographs and soil samples. Scientists have discovered that Mars once had liquid water flowing across its surface. Space telescopes like Hubble have captured images of distant galaxies billions of light-years away. These images have helped scientists understand how the universe was formed. Today, private companies are building their own rockets and spacecraft. Some are planning missions to return humans to the Moon and eventually to Mars. Space exploration remains one of humanity's greatest adventures and scientific endeavors.",
  },
  {
    id: "g5-rainforest",
    title: "The Rainforest",
    grade: 5,
    text: "Tropical rainforests are among the most biodiverse ecosystems on our planet. They cover only about six percent of Earth's land surface yet contain more than half of all plant and animal species. The Amazon rainforest alone is home to millions of species of insects, birds, mammals, and plants. Many of these species have never been formally identified by scientists. The rainforest has several distinct layers, each with its own community of organisms. The emergent layer consists of the tallest trees, which can reach over two hundred feet. Eagles, bats, and certain monkeys live in these sun-drenched heights. Below that is the dense canopy, which blocks most sunlight from reaching lower levels. The understory is dimly lit and full of shade-tolerant plants. On the forest floor, decomposers break down dead matter and recycle nutrients back into the soil. Rainforests also regulate the global climate by absorbing enormous quantities of carbon dioxide. Deforestation disrupts this process and contributes to climate change. Indigenous communities have lived sustainably in rainforests for thousands of years. Their knowledge of plants and ecology is invaluable and increasingly recognized by modern science.",
  },
  {
    id: "g5-electricity",
    title: "How Electricity Works",
    grade: 5,
    text: "Electricity powers nearly everything in modern life, from lights and refrigerators to computers and electric cars. But what exactly is electricity, and how does it work? At the atomic level, matter is made of protons, neutrons, and electrons. Electrons carry a negative charge and can sometimes move freely between atoms. When electrons flow through a conductor, such as a copper wire, they create an electric current. This current is measured in units called amperes, while the force that drives it is measured in volts. Resistance in a circuit, measured in ohms, controls how easily current flows. Together, these values follow Ohm's Law, a fundamental principle of electrical engineering. Generators produce electricity by spinning a coil of wire inside a magnetic field, converting mechanical energy into electrical energy. Power plants use steam, water, wind, or nuclear reactions to spin these generators. The electricity then travels through power lines to homes and businesses. Transformers adjust the voltage so it is safe and usable. Solar panels work differently, using photons from sunlight to knock electrons loose from silicon cells. This creates a direct current that can power devices or be stored in batteries.",
  },
  {
    id: "g6-democracy",
    title: "Democracy and Citizenship",
    grade: 6,
    text: "Democracy is a system of government in which the people hold political power. In a direct democracy, citizens vote on every law and decision themselves. In a representative democracy, citizens elect leaders to make decisions on their behalf. The United States uses a representative system, with elected officials at local, state, and federal levels. Participation in democracy goes beyond simply voting every few years. Informed citizens follow current events, discuss issues, and hold their representatives accountable. They attend public meetings, write to elected officials, and organize around causes they believe in. A healthy democracy also depends on a free press that can report the truth without fear of punishment. Courts must be independent so they can rule fairly, even against powerful interests. Civil liberties such as freedom of speech, assembly, and religion are essential protections. These rights prevent any one group from silencing others. Throughout history, groups that were excluded from democratic participation have fought for inclusion. Women's suffrage, the civil rights movement, and disability rights activism all expanded the circle of citizenship. Democracy requires ongoing effort from all members of society to function well and remain just.",
  },
  {
    id: "g7-genetics",
    title: "The Science of Genetics",
    grade: 7,
    text: "Genetics is the branch of biology that studies how traits are passed from parents to offspring. Every living organism carries instructions for its development encoded in molecules called DNA. DNA is organized into units called genes, which determine everything from eye color to disease susceptibility. Humans have approximately twenty thousand genes arranged along twenty-three pairs of chromosomes. When organisms reproduce, they pass copies of their DNA to their offspring. Sexual reproduction combines genetic material from two parents, introducing variation. This variation is the raw material on which natural selection acts over generations. Gregor Mendel, a nineteenth-century Austrian monk, laid the foundation for genetics by carefully breeding pea plants. He discovered that traits are inherited in predictable patterns governed by dominant and recessive alleles. Modern genetics has built enormously on Mendel's work. The discovery of DNA's double helix structure by Watson and Crick in 1953 opened new frontiers. Scientists can now read entire genomes and edit specific genes using tools like CRISPR. These technologies have revolutionized medicine, agriculture, and our understanding of life itself. Ethical questions about gene editing continue to be debated in science and society.",
  },
  {
    id: "g8-climate",
    title: "Climate Change: Understanding the Evidence",
    grade: 8,
    text: "Climate change refers to long-term shifts in global temperatures and weather patterns. While some climate variation is natural, scientific evidence strongly indicates that human activities are the dominant cause of the warming observed since the mid-twentieth century. The primary driver is the increase in greenhouse gases, particularly carbon dioxide and methane, released by burning fossil fuels. These gases trap heat in the atmosphere, much like the glass panels of a greenhouse. The Intergovernmental Panel on Climate Change, which synthesizes research from thousands of scientists worldwide, concludes that limiting warming to 1.5 degrees Celsius above pre-industrial levels requires rapid and deep cuts in emissions. Evidence for climate change includes rising global average temperatures, retreating glaciers and ice sheets, rising sea levels, and shifts in the timing of seasons. Extreme weather events, including intense hurricanes, prolonged droughts, and unprecedented wildfires, are becoming more frequent. Ocean acidification, caused by the absorption of excess carbon dioxide, threatens coral reefs and marine food chains. Addressing climate change requires coordinated action at every scale, from individual behavior to international treaties. Technological solutions such as renewable energy, carbon capture, and sustainable agriculture are already being deployed. The choices made in the coming decades will determine the extent of change experienced by future generations.",
  },
];
