<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\CatalogItem;
use App\Models\CatalogItemCopy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class StoryBooksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates 10 famous story books with 10 copies each.
     */
    public function run(): void
    {
        // Copy cover images from public/mock to storage
        $this->copyCoverImages();
        
        // Create categories for fiction genres
        $categories = $this->createCategories();
        
        // Create publishers
        $publishers = $this->createPublishers();
        
        // Create authors
        $authors = $this->createAuthors();
        
        // Create the 10 story books with complete information
        $books = $this->getBooksData();
        
        // Get the current max accession number from database
        $maxAccession = CatalogItemCopy::max('accession_no');
        $accessionCounter = $maxAccession ? intval($maxAccession) + 1 : 1000001;
        
        foreach ($books as $bookData) {
            // Get or create the category
            $category = $categories[$bookData['category']] ?? null;
            
            // Get or create the publisher
            $publisher = $publishers[$bookData['publisher']] ?? null;
            
            // Get or create the author(s)
            $bookAuthors = [];
            foreach ((array) $bookData['authors'] as $authorName) {
                if (isset($authors[$authorName])) {
                    $bookAuthors[] = $authors[$authorName];
                }
            }
            
            // Generate call number based on category and title
            $callNo = $this->generateCallNumber($bookData['category'], $bookData['title']);
            
            // Check if book already exists
            $existingItem = CatalogItem::where('title', $bookData['title'])->first();
            
            if ($existingItem) {
                // Update existing book with cover image
                $existingItem->update([
                    'cover_image' => $bookData['cover_image'] ?? null,
                ]);
                $this->command->info("Updated cover image for: {$bookData['title']}");
                continue;
            }
            
            // Create the catalog item (book)
            $catalogItem = CatalogItem::create([
                'title' => $bookData['title'],
                'type' => 'Books',
                'category_id' => $category?->id,
                'publisher_id' => $publisher?->id,
                'isbn' => $bookData['isbn'],
                'isbn13' => $bookData['isbn13'],
                'call_no' => $callNo,
                'subject' => $bookData['subject'],
                'series' => $bookData['series'],
                'edition' => $bookData['edition'],
                'year' => $bookData['year'],
                'place_of_publication' => $bookData['place_of_publication'],
                'extent' => $bookData['extent'],
                'other_physical_details' => $bookData['other_physical_details'],
                'dimensions' => $bookData['dimensions'],
                'description' => $bookData['description'],
                'location' => 'Fiction',
                'cover_image' => $bookData['cover_image'] ?? null,
                'is_active' => true,
                'volume' => $bookData['volume'] ?? null,
                'page_duration' => $bookData['page_duration'] ?? null,
                'abstract' => $bookData['abstract'] ?? null,
                'library_branch' => 'Main Library',
            ]);
            
            // Attach authors to the catalog item
            foreach ($bookAuthors as $author) {
                $catalogItem->authors()->attach($author->id);
            }
            
            // Create 10 copies for each book
            for ($copyNo = 1; $copyNo <= 10; $copyNo++) {
                CatalogItemCopy::create([
                    'catalog_item_id' => $catalogItem->id,
                    'accession_no' => str_pad($accessionCounter, 7, '0', STR_PAD_LEFT),
                    'copy_no' => $copyNo,
                    'branch' => 'Main Library',
                    'location' => 'Fiction',
                    'status' => 'Available',
                ]);
                $accessionCounter++;
            }
            
            $this->command->info("Created: {$bookData['title']}");
        }
        
        $this->command->info('Successfully seeded 10 story books with 10 copies each (100 total copies).');
    }
    
    /**
     * Copy cover images from public/mock/catalog-covers to storage/app/public/catalog-covers
     */
    private function copyCoverImages(): void
    {
        $sourcePath = public_path('mock/catalog-covers');
        $destPath = storage_path('app/public/catalog-covers');
        
        // Create destination directory if it doesn't exist
        if (!File::isDirectory($destPath)) {
            File::makeDirectory($destPath, 0755, true);
        }
        
        // Copy all files from source to destination
        if (File::isDirectory($sourcePath)) {
            $files = File::files($sourcePath);
            foreach ($files as $file) {
                $destFile = $destPath . '/' . $file->getFilename();
                if (!File::exists($destFile)) {
                    File::copy($file->getPathname(), $destFile);
                    $this->command->info("Copied: {$file->getFilename()}");
                }
            }
        }
    }
    
    /**
     * Create fiction categories
     */
    private function createCategories(): array
    {
        $categoriesData = [
            'Fantasy' => 'Magical worlds, mythical creatures, and supernatural elements',
            'Science Fiction' => 'Stories based on scientific concepts, space exploration, and future technologies',
            'Romance' => 'Love stories and romantic relationships',
            'Mystery' => 'Crime, detective, and puzzle-solving narratives',
            'Thriller' => 'Suspenseful, exciting stories with high tension',
            'Classic Literature' => 'Timeless literary works that have stood the test of time',
            'Dystopian' => 'Stories set in oppressive, controlled societies',
            'Adventure' => 'Action-packed journeys and explorations',
            'Horror' => 'Stories designed to frighten, scare, or disgust',
            'Historical Fiction' => 'Fiction set in the past with historical settings',
        ];
        
        $categories = [];
        foreach ($categoriesData as $name => $description) {
            $categories[$name] = Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => $description,
                    'is_published' => true,
                ]
            );
        }
        
        return $categories;
    }
    
    /**
     * Create publishers
     */
    private function createPublishers(): array
    {
        $publishersData = [
            'Bloomsbury Publishing' => ['country' => 'United Kingdom', 'description' => 'British publishing house known for Harry Potter series'],
            'Scholastic Corporation' => ['country' => 'United States', 'description' => 'American publishing and media company'],
            'T. Egerton' => ['country' => 'United Kingdom', 'description' => 'Historical British publisher'],
            'Penguin Random House' => ['country' => 'United States', 'description' => 'Largest general-interest paperback publisher in the world'],
            'Little, Brown and Company' => ['country' => 'United States', 'description' => 'American publisher with rich literary history'],
            'Doubleday' => ['country' => 'United States', 'description' => 'American publishing company founded in 1897'],
            'Vintage Books' => ['country' => 'United States', 'description' => 'American book publisher specializing in quality paperbacks'],
            'Scribner' => ['country' => 'United States', 'description' => 'American publisher known for classic American literature'],
            'HarperCollins' => ['country' => 'United States', 'description' => 'One of the world\'s largest publishing companies'],
            'Simon & Schuster' => ['country' => 'United States', 'description' => 'Major American publishing company'],
        ];
        
        $publishers = [];
        foreach ($publishersData as $name => $data) {
            $publishers[$name] = Publisher::firstOrCreate(
                ['name' => $name],
                [
                    'country' => $data['country'],
                    'description' => $data['description'],
                    'is_published' => true,
                ]
            );
        }
        
        return $publishers;
    }
    
    /**
     * Create authors
     */
    private function createAuthors(): array
    {
        $authorsData = [
            'J.K. Rowling' => ['country' => 'United Kingdom', 'bio' => 'British author best known for the Harry Potter fantasy series, one of the best-selling book series in history.'],
            'Suzanne Collins' => ['country' => 'United States', 'bio' => 'American author known for The Hunger Games trilogy and The Underland Chronicles.'],
            'Jane Austen' => ['country' => 'United Kingdom', 'bio' => 'English novelist known for her romantic fiction and social commentary in works like Pride and Prejudice.'],
            'George Orwell' => ['country' => 'United Kingdom', 'bio' => 'English novelist and essayist known for his dystopian works 1984 and Animal Farm.'],
            'Harper Lee' => ['country' => 'United States', 'bio' => 'American novelist known for her Pulitzer Prize-winning novel To Kill a Mockingbird.'],
            'F. Scott Fitzgerald' => ['country' => 'United States', 'bio' => 'American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.'],
            'Gabriel García Márquez' => ['country' => 'Colombia', 'bio' => 'Colombian novelist and Nobel Prize laureate known for his magical realism style.'],
            'Paulo Coelho' => ['country' => 'Brazil', 'bio' => 'Brazilian lyricist and novelist, best known for The Alchemist.'],
            'Dan Brown' => ['country' => 'United States', 'bio' => 'American author known for his thriller novels featuring symbologist Robert Langdon.'],
            'Agatha Christie' => ['country' => 'United Kingdom', 'bio' => 'English writer known as the Queen of Crime, creator of Hercule Poirot and Miss Marple.'],
        ];
        
        $authors = [];
        foreach ($authorsData as $name => $data) {
            $authors[$name] = Author::firstOrCreate(
                ['name' => $name],
                [
                    'country' => $data['country'],
                    'bio' => $data['bio'],
                    'is_published' => true,
                ]
            );
        }
        
        return $authors;
    }
    
    /**
     * Get the 10 story books data with cover images
     */
    private function getBooksData(): array
    {
        return [
            // 1. Harry Potter and the Philosopher's Stone - Fantasy
            [
                'title' => "Harry Potter and the Philosopher's Stone",
                'authors' => ['J.K. Rowling'],
                'publisher' => 'Bloomsbury Publishing',
                'category' => 'Fantasy',
                'isbn' => '0747532699',
                'isbn13' => '978-0747532699',
                'subject' => 'Fantasy, Magic, Wizardry, Coming of Age',
                'series' => 'Harry Potter Series (Book 1)',
                'edition' => 'First Edition',
                'year' => '1997',
                'place_of_publication' => 'London, United Kingdom',
                'extent' => '223 pages',
                'other_physical_details' => 'Illustrations by Mary GrandPré',
                'dimensions' => '20 cm x 13 cm',
                'description' => 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry\'s eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry.',
                'volume' => '1',
                'page_duration' => '223 pages',
                'abstract' => 'The first novel in the Harry Potter series follows young Harry Potter as he discovers he is a wizard and begins his journey at Hogwarts School of Witchcraft and Wizardry, where he makes friends, learns magic, and confronts the dark wizard who killed his parents.',
                'cover_image' => 'catalog-covers/91DOOgu6qhL.webp',
            ],
            
            // 2. The Hunger Games - Dystopian
            [
                'title' => 'The Hunger Games',
                'authors' => ['Suzanne Collins'],
                'publisher' => 'Scholastic Corporation',
                'category' => 'Dystopian',
                'isbn' => '0439023483',
                'isbn13' => '978-0439023481',
                'subject' => 'Dystopian Fiction, Survival, Competition, Young Adult',
                'series' => 'The Hunger Games Trilogy (Book 1)',
                'edition' => 'First Edition',
                'year' => '2008',
                'place_of_publication' => 'New York, United States',
                'extent' => '374 pages',
                'other_physical_details' => 'Mass market paperback',
                'dimensions' => '21 cm x 14 cm',
                'description' => 'In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV. Sixteen-year-old Katniss Everdeen regards it as a death sentence when she steps forward to take her sister\'s place in the Games.',
                'volume' => '1',
                'page_duration' => '374 pages',
                'abstract' => 'In a dark vision of the near future, Katniss Everdeen volunteers to take her younger sister\'s place in the Hunger Games, an annual televised competition where tributes must fight to the death until only one remains.',
                'cover_image' => 'catalog-covers/9780525578338.jpg',
            ],
            
            // 3. Pride and Prejudice - Romance/Classic Literature
            [
                'title' => 'Pride and Prejudice',
                'authors' => ['Jane Austen'],
                'publisher' => 'T. Egerton',
                'category' => 'Classic Literature',
                'isbn' => '0141439513',
                'isbn13' => '978-0141439518',
                'subject' => 'Romance, Social Class, Marriage, 19th Century England',
                'series' => null,
                'edition' => 'Penguin Classics Edition',
                'year' => '1813',
                'place_of_publication' => 'London, United Kingdom',
                'extent' => '432 pages',
                'other_physical_details' => 'Introduction and notes by Vivien Jones',
                'dimensions' => '20 cm x 13 cm',
                'description' => 'Pride and Prejudice is a romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness. Its humor lies in its honest depiction of manners, education, marriage, and money during the Regency era in Great Britain.',
                'volume' => null,
                'page_duration' => '432 pages',
                'abstract' => 'Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner. They must overcome the titular sins of pride and prejudice in order to fall in love and marry.',
                'cover_image' => 'catalog-covers/30ca8aa1184d41cd4efac93ecf5898bd.jpg',
            ],
            
            // 4. 1984 - Dystopian
            [
                'title' => 'Nineteen Eighty-Four',
                'authors' => ['George Orwell'],
                'publisher' => 'Penguin Random House',
                'category' => 'Dystopian',
                'isbn' => '0452284236',
                'isbn13' => '978-0452284234',
                'subject' => 'Dystopia, Totalitarianism, Surveillance, Political Fiction',
                'series' => null,
                'edition' => '60th Anniversary Edition',
                'year' => '1949',
                'place_of_publication' => 'London, United Kingdom',
                'extent' => '328 pages',
                'other_physical_details' => 'Afterword by Erich Fromm',
                'dimensions' => '21 cm x 14 cm',
                'description' => 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell\'s nightmarish vision of a totalitarian, bureaucratic world and one poor stiff\'s attempt to find individuality. The brilliance of the novel is Orwell\'s prescience of modern life—the ubiquity of television, the distortion of the language—and his ability to construct such a thorough vision of hell.',
                'volume' => null,
                'page_duration' => '328 pages',
                'abstract' => 'Winston Smith works for the Ministry of Truth in London, chief city of Airstrip One. Big Brother stares out from every poster, the Thought Police uncover every act of betrayal. When Winston falls in love with Julia, their affair becomes both an act of resistance and their doom.',
                'cover_image' => 'catalog-covers/9781101988640.jpg',
            ],
            
            // 5. To Kill a Mockingbird - Classic Literature
            [
                'title' => 'To Kill a Mockingbird',
                'authors' => ['Harper Lee'],
                'publisher' => 'Little, Brown and Company',
                'category' => 'Classic Literature',
                'isbn' => '0060935464',
                'isbn13' => '978-0060935467',
                'subject' => 'Racial Injustice, Childhood, Southern United States, Legal Drama',
                'series' => null,
                'edition' => '50th Anniversary Edition',
                'year' => '1960',
                'place_of_publication' => 'Philadelphia, United States',
                'extent' => '336 pages',
                'other_physical_details' => 'Foreword by the author',
                'dimensions' => '21 cm x 14 cm',
                'description' => 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Compassionate, dramatic, and deeply moving, To Kill a Mockingbird takes readers to the roots of human behavior—to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Published in 1960, this timeless classic explores how good and evil can coexist within a single community or individual.',
                'volume' => null,
                'page_duration' => '336 pages',
                'abstract' => 'Scout Finch, the narrator, lives with her older brother Jem and their widowed father Atticus in the fictional town of Maycomb, Alabama. Atticus is a lawyer who defends Tom Robinson, a Black man falsely accused of raping a white woman, teaching his children about justice and moral courage.',
                'cover_image' => 'catalog-covers/9780812984477.jpg',
            ],
            
            // 6. The Great Gatsby - Classic Literature
            [
                'title' => 'The Great Gatsby',
                'authors' => ['F. Scott Fitzgerald'],
                'publisher' => 'Scribner',
                'category' => 'Classic Literature',
                'isbn' => '0743273567',
                'isbn13' => '978-0743273565',
                'subject' => 'American Dream, Jazz Age, Wealth, Love, Social Class',
                'series' => null,
                'edition' => 'Scribner Classics Edition',
                'year' => '1925',
                'place_of_publication' => 'New York, United States',
                'extent' => '180 pages',
                'other_physical_details' => 'Authorized text with notes by Matthew J. Bruccoli',
                'dimensions' => '21 cm x 14 cm',
                'description' => 'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "ichampagne was flowing" and "gin was the national drink," is an exquisitely crafted tale of America in the 1920s.',
                'volume' => null,
                'page_duration' => '180 pages',
                'abstract' => 'Set in the summer of 1922, Nick Carraway narrates the story of Jay Gatsby, a wealthy man who throws extravagant parties hoping to rekindle his romance with Daisy Buchanan, exploring themes of decadence, idealism, and the decline of the American Dream.',
                'cover_image' => 'catalog-covers/9781984804785.jpg',
            ],
            
            // 7. One Hundred Years of Solitude - Historical Fiction/Fantasy
            [
                'title' => 'One Hundred Years of Solitude',
                'authors' => ['Gabriel García Márquez'],
                'publisher' => 'HarperCollins',
                'category' => 'Historical Fiction',
                'isbn' => '0060883286',
                'isbn13' => '978-0060883287',
                'subject' => 'Magical Realism, Family Saga, Colombian History, Latin American Literature',
                'series' => null,
                'edition' => 'Harper Perennial Modern Classics Edition',
                'year' => '1967',
                'place_of_publication' => 'Buenos Aires, Argentina',
                'extent' => '417 pages',
                'other_physical_details' => 'Translated from Spanish by Gregory Rabassa',
                'dimensions' => '21 cm x 14 cm',
                'description' => 'One Hundred Years of Solitude tells the story of the rise and fall, birth and death of the mythical town of Macondo through the history of the Buendía family. Inventive, amusing, magnetic, sad, and alive with unforgettable men and women—brimming with truth, compassion, and a lyrical magic that strikes the soul—this novel is a masterpiece in the art of fiction and a lasting contribution to world literature.',
                'volume' => null,
                'page_duration' => '417 pages',
                'abstract' => 'The multi-generational story of the Buendía family, whose patriarch, José Arcadio Buendía, founded the fictional town of Macondo in Colombia. The novel explores the themes of solitude, time, and the cyclical nature of history through magical realism.',
                'cover_image' => 'catalog-covers/6449a052796d019e74ef08e1c4ef4dc6.jpg',
            ],
            
            // 8. The Alchemist - Adventure/Fantasy
            [
                'title' => 'The Alchemist',
                'authors' => ['Paulo Coelho'],
                'publisher' => 'HarperCollins',
                'category' => 'Adventure',
                'isbn' => '0062315007',
                'isbn13' => '978-0062315007',
                'subject' => 'Self-Discovery, Treasure, Dreams, Spirituality, Journey',
                'series' => null,
                'edition' => '25th Anniversary Edition',
                'year' => '1988',
                'place_of_publication' => 'Rio de Janeiro, Brazil',
                'extent' => '208 pages',
                'other_physical_details' => 'Translated from Portuguese by Alan R. Clarke',
                'dimensions' => '19 cm x 13 cm',
                'description' => 'The Alchemist tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined. Santiago\'s journey teaches us about the essential wisdom of listening to our hearts, of recognizing opportunity and learning to read the omens strewn along life\'s path, and, most importantly, to follow our dreams.',
                'volume' => null,
                'page_duration' => '208 pages',
                'abstract' => 'Santiago, a young Andalusian shepherd, dreams of finding a treasure in the Egyptian pyramids. His journey takes him across two continents, encountering a king, an Englishman, an alchemist, and the woman of his dreams, teaching him to follow his Personal Legend.',
                'cover_image' => 'catalog-covers/ac3189c6ccb0b2205230ca7a40d81f37.jpg',
            ],
            
            // 9. The Da Vinci Code - Thriller/Mystery
            [
                'title' => 'The Da Vinci Code',
                'authors' => ['Dan Brown'],
                'publisher' => 'Doubleday',
                'category' => 'Thriller',
                'isbn' => '0385504209',
                'isbn13' => '978-0385504201',
                'subject' => 'Religious Thriller, Conspiracy, Art History, Secret Societies',
                'series' => 'Robert Langdon Series (Book 2)',
                'edition' => 'First Edition',
                'year' => '2003',
                'place_of_publication' => 'New York, United States',
                'extent' => '454 pages',
                'other_physical_details' => 'Hardcover with dust jacket',
                'dimensions' => '24 cm x 16 cm',
                'description' => 'While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in bizarre symbols. As Langdon and gifted French cryptologist Sophie Neveu sort through the bizarre riddles, they are stunned to discover a trail of clues hidden in the works of Leonardo da Vinci—clues visible for all to see and yet ingeniously disguised by the painter.',
                'volume' => '2',
                'page_duration' => '454 pages',
                'abstract' => 'Harvard symbologist Robert Langdon and French cryptologist Sophie Neveu investigate a murder at the Louvre, uncovering a secret society and a conspiracy that spans centuries, involving Leonardo da Vinci\'s artwork and a shocking historical truth.',
                'cover_image' => 'catalog-covers/5c5f12880e5f5391e09318c8a38dc99d.jpg',
            ],
            
            // 10. Murder on the Orient Express - Mystery
            [
                'title' => 'Murder on the Orient Express',
                'authors' => ['Agatha Christie'],
                'publisher' => 'HarperCollins',
                'category' => 'Mystery',
                'isbn' => '0062693662',
                'isbn13' => '978-0062693662',
                'subject' => 'Detective Fiction, Murder Mystery, Train, Hercule Poirot',
                'series' => 'Hercule Poirot Series (Book 10)',
                'edition' => 'Harper Paperbacks Edition',
                'year' => '1934',
                'place_of_publication' => 'London, United Kingdom',
                'extent' => '256 pages',
                'other_physical_details' => 'Mass market paperback',
                'dimensions' => '18 cm x 11 cm',
                'description' => 'Just after midnight, a snowdrift stops the Orient Express in its tracks. The luxurious train is surprisingly full for the time of the year, but by the morning it is one passenger fewer. An American tycoon lies dead in his compartment, stabbed a dozen times, his door locked from the inside. Isolated and with a killer in their midst, detective Hercule Poirot must find the killer among a dozen suspects trapped aboard the train.',
                'volume' => '10',
                'page_duration' => '256 pages',
                'abstract' => 'Belgian detective Hercule Poirot investigates the murder of American businessman Samuel Ratchett aboard the famous Orient Express train, where every passenger seems to have something to hide in this classic locked-room mystery.',
                'cover_image' => 'catalog-covers/images (32).jpg',
            ],
        ];
    }
    
    /**
     * Generate a call number based on category and title
     */
    private function generateCallNumber(string $category, string $title): string
    {
        $categoryPrefixes = [
            'Fantasy' => 'FAN',
            'Science Fiction' => 'SCI',
            'Romance' => 'ROM',
            'Mystery' => 'MYS',
            'Thriller' => 'THR',
            'Classic Literature' => 'CLA',
            'Dystopian' => 'DYS',
            'Adventure' => 'ADV',
            'Horror' => 'HOR',
            'Historical Fiction' => 'HIS',
        ];
        
        $prefix = $categoryPrefixes[$category] ?? 'FIC';
        
        // Get first three consonants from the title (or first letters)
        $titleCode = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $title), 0, 3));
        
        // Generate a random number
        $number = rand(100, 999);
        
        return "{$prefix} {$number}.{$titleCode}";
    }
}
