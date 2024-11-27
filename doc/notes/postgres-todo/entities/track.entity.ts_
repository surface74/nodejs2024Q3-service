import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Artist } from '../Artist/artist.entity';
import { Album } from '../Album/album.entity';
import { Favorite } from '../Favorite/fav.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.tracks, { onDelete: 'SET NULL' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Album, (album) => album.tracks, { onDelete: 'SET NULL' })
  album: Album;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  @OneToMany(() => Favorite, (favorite) => favorite.trackId, {
    onDelete: 'SET NULL',
  })
  favorites: Favorite[];
}
