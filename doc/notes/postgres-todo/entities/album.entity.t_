import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Artist } from '../Artist/artist.entity';
import { Track } from '../Track/track.entity';
import { Favorite } from '../Favorite/fav.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string | null;

  @OneToMany(() => Track, (track) => track.albumId, { onDelete: 'SET NULL' })
  tracks: Track[];

  @OneToMany(() => Favorite, (favorite) => favorite.trackId, {
    onDelete: 'SET NULL',
  })
  favorites: Favorite[];
}
